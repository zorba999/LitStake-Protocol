// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./StakedLTC.sol";

/// @notice Liquid staking vault for zkLTC on LitVM LiteForge Testnet.
///
/// How it works:
///   deposit zkLTC → receive stLTC (receipt token)
///   stLTC value grows as yield is added to the vault
///   burn stLTC → receive zkLTC at current exchange rate
///
/// Exchange rate = vault_balance * 1e18 / stLTC_totalSupply
/// On first deposit the rate is 1:1. Owner can inject yield
/// to simulate APY on testnet.
contract LTCStaking is Ownable, ReentrancyGuard {
    StakedLTC public immutable stLTC;

    uint16 public constant SIMULATED_APY_BPS = 500; // 5%

    event Staked(address indexed user, uint256 zkLTCAmount, uint256 stLTCMinted);
    event Unstaked(address indexed user, uint256 stLTCBurned, uint256 zkLTCReturned);
    event YieldInjected(uint256 amount);

    error ZeroAmount();
    error InsufficientStLTC();
    error InsufficientLiquidity();
    error TransferFailed();

    constructor(address _stLTC) Ownable(msg.sender) {
        stLTC = StakedLTC(_stLTC);
    }

    // ─── External ──────────────────────────────────────────────────────────

    /// @notice Stake native zkLTC and receive stLTC.
    function stake() external payable nonReentrant {
        if (msg.value == 0) revert ZeroAmount();

        uint256 toMint = _calcStLTC(msg.value);
        stLTC.mint(msg.sender, toMint);

        emit Staked(msg.sender, msg.value, toMint);
    }

    /// @notice Burn stLTC and receive zkLTC at current exchange rate.
    function unstake(uint256 stLTCAmount) external nonReentrant {
        if (stLTCAmount == 0) revert ZeroAmount();
        if (stLTC.balanceOf(msg.sender) < stLTCAmount) revert InsufficientStLTC();

        uint256 zkLTCOut = _calczkLTC(stLTCAmount);
        if (address(this).balance < zkLTCOut) revert InsufficientLiquidity();

        stLTC.burn(msg.sender, stLTCAmount);

        (bool ok, ) = payable(msg.sender).call{value: zkLTCOut}("");
        if (!ok) revert TransferFailed();

        emit Unstaked(msg.sender, stLTCAmount, zkLTCOut);
    }

    /// @notice Owner injects zkLTC to simulate yield, raising the exchange rate.
    function injectYield() external payable onlyOwner {
        emit YieldInjected(msg.value);
    }

    // ─── Views ─────────────────────────────────────────────────────────────

    /// @notice How many zkLTC wei you get per 1e18 stLTC (the share price).
    function exchangeRate() public view returns (uint256) {
        uint256 supply = stLTC.totalSupply();
        if (supply == 0) return 1e18;
        return address(this).balance * 1e18 / supply;
    }

    /// @notice Total zkLTC locked in the vault.
    function totalAssets() public view returns (uint256) {
        return address(this).balance;
    }

    /// @notice Preview: how much stLTC you get for `zkLTCAmount`.
    function previewStake(uint256 zkLTCAmount) external view returns (uint256) {
        return _calcStLTC(zkLTCAmount);
    }

    /// @notice Preview: how much zkLTC you get for `stLTCAmount`.
    function previewUnstake(uint256 stLTCAmount) external view returns (uint256) {
        return _calczkLTC(stLTCAmount);
    }

    // ─── Internal ──────────────────────────────────────────────────────────

    function _calcStLTC(uint256 zkLTCIn) internal view returns (uint256) {
        uint256 supply = stLTC.totalSupply();
        // balance already includes zkLTCIn at call time
        uint256 prevBalance = address(this).balance - zkLTCIn;
        if (supply == 0 || prevBalance == 0) return zkLTCIn;
        return (zkLTCIn * supply) / prevBalance;
    }

    function _calczkLTC(uint256 stLTCIn) internal view returns (uint256) {
        uint256 supply = stLTC.totalSupply();
        if (supply == 0) return stLTCIn;
        return (stLTCIn * address(this).balance) / supply;
    }

    receive() external payable {}
}
