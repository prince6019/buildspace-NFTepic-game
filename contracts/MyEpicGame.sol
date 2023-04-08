// SPDX-License-Identifier:MIT
pragma solidity ^0.8.17;
import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";

error ERC721Metadata__URI_QueryFor_NonExistentToken();
error lowHp();

/**
@title contract for mint character Nfts
@author Prince Sharma
@notice you can use this contract for mint NFTs
*/
contract MyEpicGame is ERC721, VRFConsumerBaseV2 {
    // using library Counters
    using Counters for Counters.Counter;

    // chainlink variables
    VRFCoordinatorV2Interface private immutable i_VRFCoordinator;
    bytes32 private immutable i_gasLane;
    uint64 immutable i_subscriptionId;
    uint32 immutable i_callbackGasLimit;
    uint16 constant REQUEST_CONFIRMATIONS = 3;
    uint32 constant NUM_WORDS = 1;
    // struct for character NFTs
    struct characterAttributes {
        uint256 index;
        string name;
        string imageUri;
        uint256 hp;
        uint256 attackDamage;
        uint256 maxHp;
    }
    struct evilBoss {
        uint256 hp;
        uint256 attackDamage;
        uint256 maxHp;
    }
    // nft minting event
    event characterMintedNft(
        address indexed sender,
        uint256 indexed tokenId,
        uint256 indexed characterIndex
    );
    event attackComplete(
        address indexed sender,
        uint256 indexed bossHp,
        uint256 indexed playerHp
    );
    event requestedUserCharacter(uint256 indexed requestId);
    // array of type characterAttribute type
    evilBoss private s_evilboss;

    characterAttributes[] private defaultCharacters;
    uint256 public s_index;

    Counters.Counter private s_tokenIds;

    // mapping of minter to token id to characternft
    mapping(address => uint256) private s_NFTHolders;
    mapping(uint256 => characterAttributes) private s_NFTHolderAttributes;

    constructor(
        string[] memory charactername,
        string[] memory characterImageUri,
        uint256[] memory characterHp,
        uint256[] memory characterAttackDamage,
        uint256 bossHp,
        uint256 bossAttackDamage,
        address vrfCoordinatorV2,
        uint64 subscriptionId,
        bytes32 gasLane,
        uint32 callbackGasLimit
    ) ERC721("HEROES", "HERO") VRFConsumerBaseV2(vrfCoordinatorV2) {
        s_evilboss = evilBoss(bossHp, bossAttackDamage, bossHp);

        i_callbackGasLimit = callbackGasLimit;
        i_subscriptionId = subscriptionId;
        i_gasLane = gasLane;
        i_VRFCoordinator = VRFCoordinatorV2Interface(vrfCoordinatorV2);

        for (uint256 i = 0; i < charactername.length; i++) {
            defaultCharacters.push(
                characterAttributes(
                    i,
                    charactername[i],
                    characterImageUri[i],
                    characterHp[i],
                    characterAttackDamage[i],
                    characterHp[i]
                )
            );

            characterAttributes memory c = defaultCharacters[i];
            console.log(
                "Done initializing %s w/ HP %s , img %s",
                c.name,
                c.hp,
                c.imageUri
            );
        }
        s_tokenIds.increment();
    }

    /// @notice it takes a tokenid and returns the url for your NFT
    /// @return the base-64 encoded url of nft

    function tokenURI(
        uint256 _tokenId
    ) public view override returns (string memory) {
        if (!_exists(_tokenId)) {
            revert ERC721Metadata__URI_QueryFor_NonExistentToken();
        }
        characterAttributes memory charAttribute = s_NFTHolderAttributes[
            _tokenId
        ];
        string memory strHp = Strings.toString(charAttribute.hp);
        string memory strMaxHp = Strings.toString(charAttribute.maxHp);
        string memory strAttackDamage = Strings.toString(
            charAttribute.attackDamage
        );

        string memory str1 = "data:application/json;base64,";
        string memory json = Base64.encode(
            abi.encodePacked(
                '{"name":"',
                charAttribute.name,
                "--NFt #: ",
                Strings.toString(_tokenId),
                '", "description": "This is an NFT that lets people play in the game Metaverse Slayer!" , "image": "',
                charAttribute.imageUri,
                '","attributes": [{"trait_type": "Health Points", "value": ',
                strHp,
                ', "max_value":',
                strMaxHp,
                '}, { "trait_type": "Attack Damage", "value": ',
                strAttackDamage,
                "}]}"
            )
        );

        return string.concat(str1, json);
    }

    function requestRandomNumber() public {
        uint256 requestId = i_VRFCoordinator.requestRandomWords(
            i_gasLane,
            i_subscriptionId,
            REQUEST_CONFIRMATIONS,
            i_callbackGasLimit,
            NUM_WORDS
        );
        emit requestedUserCharacter(requestId);
    }

    function fulfillRandomWords(
        uint256 /*requestId*/,
        uint256[] memory randomWords
    ) internal override {
        uint256 indexOfCharacters = randomWords[0] % defaultCharacters.length;
        console.log("randomindex is : ", indexOfCharacters);
        s_index = indexOfCharacters;
    }

    /// @notice mints the nft and updates the mapping
    /// @dev increments the tokenid and return nothing

    function mintCharacterNFT() external {
        uint256 _characterIndex = s_index;
        console.log("index of Nft to be minted : ", s_index);

        uint256 newItemId = s_tokenIds.current();
        _safeMint(msg.sender, newItemId);
        s_NFTHolderAttributes[newItemId] = characterAttributes(
            _characterIndex,
            defaultCharacters[_characterIndex].name,
            defaultCharacters[_characterIndex].imageUri,
            defaultCharacters[_characterIndex].hp,
            defaultCharacters[_characterIndex].attackDamage,
            defaultCharacters[_characterIndex].maxHp
        );

        console.log(
            "Minted Nft w/ tokenId %s and characterIndex %s",
            newItemId,
            _characterIndex
        );
        s_NFTHolders[msg.sender] = newItemId;
        s_tokenIds.increment();
        emit characterMintedNft(msg.sender, newItemId, _characterIndex);
    }

    function attackBoss() public {
        uint256 tokenId = s_NFTHolders[msg.sender];
        characterAttributes storage player = s_NFTHolderAttributes[tokenId];

        console.log(
            "Boss %s has %s HP and %s AD",
            s_evilboss.hp,
            s_evilboss.attackDamage
        );

        if (player.hp <= 0 || s_evilboss.hp <= 0) {
            revert lowHp();
        }
        if (s_evilboss.hp < player.attackDamage) {
            s_evilboss.hp = 0;
        } else {
            s_evilboss.hp -= player.attackDamage;
        }
        if (player.hp < s_evilboss.attackDamage) {
            player.hp = 0;
        } else {
            player.hp -= s_evilboss.attackDamage;
        }

        console.log("Player attacked boss. New Boss hp: %s", s_evilboss.hp);
        console.log("Boss attacked player. New Player hp:%s\n", player.hp);

        emit attackComplete(msg.sender, s_evilboss.hp, player.hp);
    }

    // getter functions---------

    function checkIfUserHasNFT()
        public
        view
        returns (characterAttributes memory)
    {
        uint256 userNfttokenId = s_NFTHolders[msg.sender];
        if (userNfttokenId > 0) {
            return s_NFTHolderAttributes[userNfttokenId];
        } else {
            characterAttributes memory emptystruct;
            return emptystruct;
        }
    }

    function getAlldefaultCharacters()
        public
        view
        returns (characterAttributes[] memory)
    {
        return defaultCharacters;
    }

    function getbigBoss() public view returns (evilBoss memory) {
        return s_evilboss;
    }

    function getTokenId() public view returns (Counters.Counter memory) {
        return s_tokenIds;
    }
}
