// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title Amanah PropTech eWpG Token
 * @dev implementation of a simplified ERC-3643 (T-Rex) compliant token for German eWpG rules.
 * This contract enforces:
 * - On-Chain KYC (Whitelisting)
 * - Sharia Compliance Halts
 * - BaFin Regulatory Freezes
 * - Asset-backed Fractional Ownership
 */

interface IIdentityRegistry {
    function isVerified(address _investor) external view returns (bool);
}

contract eWpGToken {
    string public name;
    string public symbol;
    uint256 public totalSupply;
    address public owner;
    
    // BaFin / Admin Authority
    address public bafinAgent;
    
    // Sharia Compliance Board
    address public shariaBoard;
    
    // IPFS Hash for Legal Document (Basisinformationsblatt)
    string public documentHash;
    
    // Identity Registry for KYC (ERC-3643 Compliance)
    IIdentityRegistry public identityRegistry;

    mapping(address => uint256) public balances;
    mapping(address => bool) public isFrozen;
    
    bool public isGlobalFreeze = false;
    bool public isShariaCompliant = true;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Frozen(address indexed investor);
    event Unfrozen(address indexed investor);
    event GlobalHalt(string reason);
    event DocumentUpdated(string newHash);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not token issuer");
        _;
    }

    modifier onlyAgent() {
        require(msg.sender == bafinAgent || msg.sender == owner, "Not authorized agent");
        _;
    }

    modifier canTransfer(address _from, address _to) {
        require(!isGlobalFreeze, "Token transfers halted globally by BaFin/Issuer");
        require(isShariaCompliant, "Token halted by Sharia Board");
        require(!isFrozen[_from], "Sender account is frozen");
        require(!isFrozen[_to], "Receiver account is frozen");
        
        if (address(identityRegistry) != address(0)) {
            require(identityRegistry.isVerified(_to), "Receiver lacks KYC compliance");
        }
        _;
    }

    constructor(
        string memory _name, 
        string memory _symbol, 
        address _registry, 
        address _bafinAgent,
        address _shariaBoard
    ) {
        name = _name;
        symbol = _symbol;
        owner = msg.sender;
        identityRegistry = IIdentityRegistry(_registry);
        bafinAgent = _bafinAgent;
        shariaBoard = _shariaBoard;
    }

    /**
     * @dev Mint tokens for a KYC verified investor resulting from Fiat/Crypto purchase.
     */
    function mint(address _to, uint256 _amount) external onlyOwner {
        if (address(identityRegistry) != address(0)) {
            require(identityRegistry.isVerified(_to), "Cannot mint to unverified address");
        }
        totalSupply += _amount;
        balances[_to] += _amount;
        emit Transfer(address(0), _to, _amount);
    }

    /**
     * @dev Transfer function protected by Compliance Modifiers.
     */
    function transfer(address _to, uint256 _amount) external canTransfer(msg.sender, _to) returns (bool) {
        require(balances[msg.sender] >= _amount, "Insufficient balance");
        
        balances[msg.sender] -= _amount;
        balances[_to] += _amount;
        
        emit Transfer(msg.sender, _to, _amount);
        return true;
    }

    /**
     * @dev eWpG Enforcement Actions (Regulatory Freezes).
     */
    function freezeAccount(address _investor) external onlyAgent {
        isFrozen[_investor] = true;
        emit Frozen(_investor);
    }

    function unfreezeAccount(address _investor) external onlyAgent {
        isFrozen[_investor] = false;
        emit Unfrozen(_investor);
    }

    function haltTransfers(string calldata _reason) external onlyAgent {
        isGlobalFreeze = true;
        emit GlobalHalt(_reason);
    }

    /**
     * @dev Sharia Board Intervention.
     */
    function revokeShariaCompliance(string calldata _reason) external {
        require(msg.sender == shariaBoard, "Not Sharia Board");
        isShariaCompliant = false;
        isGlobalFreeze = true;
        emit GlobalHalt(_reason);
    }

    /**
     * @dev Set the IPFS Hash of the BaFin Information Document (eWpG requirement).
     */
    function setDocument(string calldata _hash) external onlyAgent {
        documentHash = _hash;
        emit DocumentUpdated(_hash);
    }
}
