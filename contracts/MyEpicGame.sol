// SPDX-License-Identifier:MIT
pragma solidity ^0.8.17;
import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

error ERC721Metadata__URI_QueryFor_NonExistentToken();

/**
@title contract for mint character Nfts
@author Prince Sharma
@notice you can use this contract for mint NFTs
*/
contract MyEpicGame is ERC721 {
    // using library Counters
    using Counters for Counters.Counter;

    // struct
    struct characterAttributes {
        uint256 index;
        string name;
        string imageUri;
        uint256 hp;
        uint256 attackDamage;
        uint256 maxHp;
    }

    // array of type characterAttribute type
    characterAttributes[] defaultCharacters;

    Counters.Counter private s_tokenIds;

    // mapping of minter to token id to characternft
    mapping(address => uint256) private s_NFTHolders;
    mapping(uint256 => characterAttributes) private s_NFTHolderAttributes;

    constructor(
        string[] memory charactername,
        string[] memory characterImageUri,
        uint256[] memory characterHp,
        uint256[] memory characterAttackDamage
    ) ERC721("HEROES", "HERO") {
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

    /// @notice mints the nft and updates the mapping
    /// @dev increments the tokenid and return nothing

    function mintCharacterNFT(uint256 _characterIndex) external {
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
    }

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
}
