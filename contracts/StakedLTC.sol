// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @notice ERC20 receipt token representing staked zkLTC.
///         Only the LTCStaking vault can mint or burn.
contract StakedLTC is ERC20, Ownable {
    address public stakingContract;

    error NotStakingContract();
    error StakingAlreadySet();

    modifier onlyStaking() {
        if (msg.sender != stakingContract) revert NotStakingContract();
        _;
    }

    constructor() ERC20("Staked zkLTC", "stLTC") Ownable(msg.sender) {}

    /// @notice Called once after LTCStaking is deployed.
    function setStakingContract(address _staking) external onlyOwner {
        if (stakingContract != address(0)) revert StakingAlreadySet();
        stakingContract = _staking;
    }

    function mint(address to, uint256 amount) external onlyStaking {
        _mint(to, amount);
    }

    function burn(address from, uint256 amount) external onlyStaking {
        _burn(from, amount);
    }
}
