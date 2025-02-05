<script lang="ts">
    import { onMount } from 'svelte';
    import { slide, fade } from 'svelte/transition';
    
    let totalBalance = {
        btc: 0,
        usd: 0.00,
        change: '+0.00%'
    };

    let assetBalance = {
        btc: 0,
        usd: 0.00,
        change: '+0.00%'
    };

    let exchangeBalance = {
        btc: 0,
        usd: 0.00,
        change: '+0.00%'
    };

    let showZeroBalances = true;
    let isLoading = true;

    // Add these new variables
    let showWithdrawModal = false;
    let selectedCrypto = {
        symbol: 'BTC',
        name: 'Bitcoin',
        icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48Y2lyY2xlIGN4PSIxNiIgY3k9IjE2IiByPSIxNiIgZmlsbD0iI2Y3OTMxYSIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0yMy4xODkgMTQuMDJjLjMxNC0yLjA5Ni0xLjI4My0zLjIyMy0zLjQ2NS0zLjk3NWwuNzA4LTIuODQtMS43MjgtLjQzLS42OSAyLjc2NWMtLjQ1NC0uMTE0LS45Mi0uMjItMS4zODUtLjMyNmwuNjk1LTIuNzgzTDE1LjU5NiA2bC0uNzA4IDIuODM5Yy0uMzc2LS4wODYtLjc0NS0uMTctMS4xMDQtLjI2bC4wMDItLjAwOS0yLjM4NC0uNTk1LS40NiAxLjg0NnMxLjI4My4yOTQgMS4yNTYuMzEyYy43LjE3NS44MjYuNjM4LjgwNSAxLjAwNmwtLjgwNiAzLjIzNWMuMDQ4LjAxMi4xMS4wMy4xOC4wNTdsLS4xODMtLjA0NS0xLjEzIDQuNTMyYy0uMDg2LjIxMi0uMzAzLjUzMS0uNzkzLjQxLjAxOC4wMjYtMS4yNTYtLjMxMy0xLjI1Ni0uMzEzbC0uODU4IDEuOTc4IDIuMjUuNTYyYy40MTguMTA1LjgyOC4yMTUgMS4yMzEuMzE4bC0uNzE1IDIuODcyIDEuNzI3LjQzLjcwOC0yLjg0Yy40NzIuMTI3LjkzLjI0NSAxLjM3OC4zNTdsLS43MDYgMi44MjggMS43MjguNDMuNzE1LTIuODY2YzIuOTQ4LjU1OCA1LjE2NC4zMzMgNi4wOTctMi4zMzIuNzUyLTIuMTQ2LS4wMzctMy4zODUtMS41ODgtNC4xOTIgMS4xMy0uMjYgMS45OC0xLjAwMyAyLjIwNy0yLjUzOHptLTMuOTUgNS41MzhjLS41MzMgMi4xNDctNC4xNDguOTg2LTUuMzIuNjk1bC45NS0zLjgwNWMxLjE3Mi4yOTMgNC45MjkuODcyIDQuMzcgMy4xMXptLjUzNS01LjU2OWMtLjQ4NyAxLjk1My0zLjQ5NS45Ni00LjQ3LjcxN2wuODYtMy40NWMuOTc1LjI0MyA0LjExOC42OTYgMy42MSAyLjczM3oiLz48L2c+PC9zdmc+'
    };
    let withdrawAddress = '';
    let withdrawAmount = '';

    // Add this new interface and data
    interface Cryptocurrency {
        symbol: string;
        name: string;
        icon: string;
    }

    const cryptocurrencies: Cryptocurrency[] = [
        {
            symbol: 'BTC',
            name: 'Bitcoin',
            icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48Y2lyY2xlIGN4PSIxNiIgY3k9IjE2IiByPSIxNiIgZmlsbD0iI2Y3OTMxYSIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0yMy4xODkgMTQuMDJjLjMxNC0yLjA5Ni0xLjI4My0zLjIyMy0zLjQ2NS0zLjk3NWwuNzA4LTIuODQtMS43MjgtLjQzLS42OSAyLjc2NWMtLjQ1NC0uMTE0LS45Mi0uMjItMS4zODUtLjMyNmwuNjk1LTIuNzgzTDE1LjU5NiA2bC0uNzA4IDIuODM5Yy0uMzc2LS4wODYtLjc0NS0uMTctMS4xMDQtLjI2bC4wMDItLjAwOS0yLjM4NC0uNTk1LS40NiAxLjg0NnMxLjI4My4yOTQgMS4yNTYuMzEyYy43LjE3NS44MjYuNjM4LjgwNSAxLjAwNmwtLjgwNiAzLjIzNWMuMDQ4LjAxMi4xMS4wMy4xOC4wNTdsLS4xODMtLjA0NS0xLjEzIDQuNTMyYy0uMDg2LjIxMi0uMzAzLjUzMS0uNzkzLjQxLjAxOC4wMjYtMS4yNTYtLjMxMy0xLjI1Ni0uMzEzbC0uODU4IDEuOTc4IDIuMjUuNTYyYy40MTguMTA1LjgyOC4yMTUgMS4yMzEuMzE4bC0uNzE1IDIuODcyIDEuNzI3LjQzLjcwOC0yLjg0Yy40NzIuMTI3LjkzLjI0NSAxLjM3OC4zNTdsLS43MDYgMi44MjggMS43MjguNDMuNzE1LTIuODY2YzIuOTQ4LjU1OCA1LjE2NC4zMzMgNi4wOTctMi4zMzIuNzUyLTIuMTQ2LS4wMzctMy4zODUtMS41ODgtNC4xOTIgMS4xMy0uMjYgMS45OC0xLjAwMyAyLjIwNy0yLjUzOHptLTMuOTUgNS41MzhjLS41MzMgMi4xNDctNC4xNDguOTg2LTUuMzIuNjk1bC45NS0zLjgwNWMxLjE3Mi4yOTMgNC45MjkuODcyIDQuMzcgMy4xMXptLjUzNS01LjU2OWMtLjQ4NyAxLjk1My0zLjQ5NS45Ni00LjQ3LjcxN2wuODYtMy40NWMuOTc1LjI0MyA0LjExOC42OTYgMy42MSAyLjczM3oiLz48L2c+PC9zdmc+'
        },
        {
            symbol: 'ETH',
            name: 'Ethereum',
            icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiI+PGcgZmlsbD0ibm9uZSI+PGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iMTYiIGZpbGw9IiM2MjdFRUEiLz48ZyBmaWxsPSIjRkZGIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGwtb3BhY2l0eT0iLjYwMiIgZD0iTTE2LjQ5OCA0djguODdsMy40OTcgMy4zNXoiLz48cGF0aCBkPSJNMTYuNDk4IDR2OC44N2wtNy40OTcgMy4zNXoiLz48cGF0aCBmaWxsLW9wYWNpdHk9Ii42MDIiIGQ9Ik0xNi40OTggMjEuOTY4djYuMDI3bDcuNDk3LTEwLjM3OXoiLz48cGF0aCBkPSJNMTYuNDk4IDI3Ljk5NXYtNi4wMjhMOSAxNy42MTZ6Ii8+PHBhdGggZmlsbC1vcGFjaXR5PSIuMiIgZD0iTTE2LjQ5OCAyMC41NzNsMy40OTctMy4zNS0zLjQ5Ny0xLjY3NHoiLz48cGF0aCBmaWxsLW9wYWNpdHk9Ii42MDIiIGQ9Ik05IDE3LjIyM2wzLjQ5OC0zLjM1IDMuOTk5IDYuNzAxeiIvPjwvZz48L2c+PC9zdmc+'
        },
        {
            symbol: 'BNB',
            name: 'Binance Coin',
            icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiI+PGcgZmlsbD0ibm9uZSI+PGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iMTYiIGZpbGw9IiNGM0JBMkYiLz48cGF0aCBmaWxsPSIjRkZGIiBkPSJNMTIuMTE2IDE0LjQwNEwxNiAxMC41MmwzLjg4NiAzLjg4NmwyLjI2LTIuMjZMMTYgNmwtNi4xNDQgNi4xNDQgMi4yNiAyLjI2ek02IDE2bDIuMjYtMi4yNkwxMC41MiAxNmwtMi4yNiAyLjI2TDYgMTZ6bTYuMTE2IDEuNTk2TDE2IDIxLjQ4bDMuODg2LTMuODg2IDIuMjYgMi4yNTlMMTYgMjZsLTYuMTQ0LTYuMTQ0LTIuMjYtMi4yNiAyLjI2LTIuMjZ6bTEyLjI2OC0xLjU5NmwtMi4yNi0yLjI2TDIxLjQ4IDE2bDIuMjYgMi4yNkwyNiAxNnptLTguNDg1IDB6Ii8+PC9nPjwvc3ZnPg=='
        },
        {
            symbol: 'BCH',
            name: 'Bitcoin Cash',
            icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48Y2lyY2xlIGN4PSIxNiIgY3k9IjE2IiByPSIxNiIgZmlsbD0iIzgwQzNENyIvPjxwYXRoIGZpbGw9IiNGRkYiIGQ9Ik0yMS43OCAxNS4xYy0uMjUtMS4xNy0xLjMyLTEuNi0yLjQ0LTEuNzN2LTEuOWgtMS40OHYxLjg2Yy0uMzkgMC0uNzguMDEtMS4xNy4wMlYxMS41aC0xLjQ4djEuODZjLS4zMS4wMS0uNjIuMDEtLjkzLjAxdjAuMDFIOTEydjEuNThoMS4yNGMuNjYgMCAuODguMjUuOTQuODJ2MS42OGMuMDYgMCAuMTEgMCAuMTYuMDFoLS4xNnY0LjA3Yy0uMDMuMzctLjE3LjgxLS44NS44MWgtMS4yNGwtLjAxIDEuNzVoMi4zN3YuMDFjLjM1IDAgLjcgMCAxLjA1LS4wMXYxLjg2aDEuNDh2LTEuODZjLjQtLjAxLjgtLjAyIDEuMTctLjAydjEuODZoMS40OHYtMS44N2MxLjcxLS4xIDMuMDEtLjUgMy4zNy0yLjA3LjI5LTEuMjctLjA1LTIuMDItLjg1LTIuNDQuNjEtLjMxIDEuMDMtLjk5Ljg1LTIuMDJNMjAuNDEgMTljLS4yMSAxLjYxLTMuMzUuOTEtNC4yNy45MXYtMi45MWMuOTIgMCA0LjA3LS43NCA0LjI3IDJtLS4yMS0zLjdjLS4xOSAxLjU5LTIuOC45MS0zLjU3Ljkxdi0yLjkxYy43NyAwIDMuMzktLjY3IDMuNTcgMiIvPjwvZz48L3N2Zz4='
        },
        {
            symbol: 'TON',
            name: 'Toncoin',
            icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiI+PGcgZmlsbD0ibm9uZSI+PGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iMTYiIGZpbGw9IiMwMDg4Q0MiLz48cGF0aCBmaWxsPSIjRkZGIiBkPSJNMjIuMTMzIDExLjY1MmwtMTMuMDY2IDQuODc1Yy0uMjM1LjA4OC0uMzIuMzc2LS4xNzcuNTk4bDYuMjkgOS43MzJjLjA5Ny4xNS4yOTQuMTk3LjQ0OC4xMDhsMTMuMDY2LTQuODc1Yy4yMzUtLjA4OC4zMi0uMzc2LjE3Ny0uNTk4bC02LjI5LTkuNzMyYy0uMDk3LS4xNS0uMjk0LS4xOTctLjQ0OC0uMTA4eiIvPjwvZz48L3N2Zz4='
        },
        {
            symbol: 'TRX',
            name: 'Tron',
            icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiI+PGcgZmlsbD0ibm9uZSI+PGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iMTYiIGZpbGw9IiNFRjAwMjgiLz48cGF0aCBmaWxsPSIjRkZGIiBkPSJNMjEuMzg3IDEyLjgyM2wtLjk1LTEuMDQ0Yy0uMDc1LS4wODItLjE5LS4xMjMtLjMwNC0uMTIzaC0yLjI4NmMtLjExNCAwLS4yMjguMDQxLS4zMDQuMTIzbC0uOTUgMS4wNDRjLS4wNzUuMDgyLS4wNzUuMjA1IDAgLjI4N2wyLjI4NiAyLjUxMmMuMDc1LjA4Mi4xOS4xMjMuMzA0LjEyM2gyLjI4NmMuMTE0IDAgLjIyOC0uMDQxLjMwNC0uMTIzbDIuMjg2LTIuNTEyYy4wNzUtLjA4Mi4wNzUtLjIwNSAwLS4yODdsLTIuMjg2LTIuNTEyYy0uMDc1LS4wODItLjE5LS4xMjMtLjMwNC0uMTIzaC0yLjI4NmMtLjExNCAwLS4yMjguMDQxLS4zMDQuMTIzbC0uOTUgMS4wNDRjLS4wNzUuMDgyLS4wNzUuMjA1IDAgLjI4N2wyLjI4NiAyLjUxMmMuMDc1LjA4Mi4xOS4xMjMuMzA0LjEyM2gyLjI4NmMuMTE0IDAgLjIyOC0uMDQxLjMwNC0uMTIzbDIuMjg2LTIuNTEyYy4wNzUtLjA4Mi4wNzUtLjIwNSAwLS4yODd6Ii8+PC9nPjwvc3ZnPg=='
        },
        {
            symbol: 'MATIC',
            name: 'Polygon',
            icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiI+PGcgZmlsbD0ibm9uZSI+PGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iMTYiIGZpbGw9IiM4MjQ3RTUiLz48cGF0aCBmaWxsPSIjRkZGIiBkPSJNMjEuMTQzIDE1LjMxMmwtNC4xNDMtMi4zOTh2NC43OTZsMi4wNzEgMS4xOTkgMi4wNzItMS4xOTl2LTIuMzk4em0tNC4xNDMgNC43OTZsLTQuMTQzLTIuMzk4djQuNzk2bDIuMDcxIDEuMTk5IDIuMDcyLTEuMTk5di0yLjM5OHptLTQuMTQzLTcuMTk0bC00LjE0My0yLjM5OHY0Ljc5NmwyLjA3MSAxLjE5OSAyLjA3Mi0xLjE5OXYtMi4zOTh6Ii8+PC9nPjwvc3ZnPg=='
        },
        {
            symbol: 'SHIB',
            name: 'Shiba Inu',
            icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiI+PGcgZmlsbD0ibm9uZSI+PGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iMTYiIGZpbGw9IiNFODREMEQiLz48cGF0aCBmaWxsPSIjRkZGIiBkPSJNMTMuNzMgMTQuOTVjLS4yNS0uMjUtLjY1LS4yNS0uOS4wNS0uMjUuMjUtLjI1LjY1LjA1LjkuMjUuMjUuNjUuMjUuOS0uMDUuMjUtLjI1LjI1LS42NS0uMDUtLjl6bTQuNTQgMGMtLjI1LS4yNS0uNjUtLjI1LS45LjA1LS4yNS4yNS0uMjUuNjUuMDUuOS4yNS4yNS42NS4yNS45LS4wNS4yNS0uMjUuMjUtLjY1LS4wNS0uOXpNMTYgOGMtNC40MiAwLTggMy41OC04IDhzMy41OCA4IDggOCA4LTMuNTggOC04LTMuNTgtOC04LTh6bTAgMTQuNWMtMy41OCAwLTYuNS0yLjkyLTYuNS02LjVTMTIuNDIgOS41IDE2IDkuNXM2LjUgMi45MiA2LjUgNi41LTIuOTIgNi41LTYuNSA2LjV6Ii8+PC9nPjwvc3ZnPg=='
        },
        {
            symbol: 'SOL',
            name: 'Solana',
            icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiI+PGcgZmlsbD0ibm9uZSI+PGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iMTYiIGZpbGw9IiMwMEZGQTMiLz48cGF0aCBmaWxsPSIjRkZGIiBkPSJNMTIuNSAxMC4yNWw1LTIuODc1IDUtMi44NzV2NS43NWwtNSAyLjg3NS01IDIuODc1di01Ljc1em0wIDExLVs5LTIuODc1IDUtMi44NzV2NS43NWwtNSAyLjg3NS01IDIuODc1di01Ljc1eiIvPjwvZz48L3N2Zz4='
        },
        {
            symbol: 'DOGE',
            name: 'Dogecoin',
            icon: 'https://dynamic-assets.coinbase.com/3803f30367bb3972e192cd3fdd2230cd37e6d468eab12575a859229b20f12ff9b6c3dbfc4a134dc7add8bb3474f3f5223c1ead0e2c9f43ef5b0ad4c5f075784c/asset_icons/1597d628dd19b7885433a2ac2d7de6ad196c519aeab4bfe679706aacbf1df78a.png'
        },
        {
            symbol: 'LTC',
            name: 'Litecoin',
            icon: 'https://dynamic-assets.coinbase.com/f018870b721574ef7f269b9fd91b36042dc05ebed4ae9dcdc340a1bae5b359e8760a8c224bc99466db704d10a3e23cf1f4cd1ff6f647340c4c9c899a9e6595cd/asset_icons/984a4fe2ba5b2c325c06e4c2f3ba3f1c1fef1f157edb3b8ebbfe234340a157a5.png'
        },
        {
            symbol: 'USDT',
            name: 'Tether',
            icon: 'https://dynamic-assets.coinbase.com/41f6a93a3a222078c939115fc304a67c384886b7a9e6c15dcbfa6519dc45f6bb4a586e9c48535d099efa596dbf8a9dd72b05815bcd32ac650c50abb5391a5bd0/asset_icons/1f8489bb280fb0a0fd643c1161312ba49655040e9aaaced5f9ad3eeaf868eadc.png'
        },
        {
            symbol: 'DAI',
            name: 'Dai',
            icon: 'https://dynamic-assets.coinbase.com/90184cca292578d533bb00d9ee98529b889c15126bb120582309286b9129df9886781b30c85c21ee9cae9f2db6dc11e88633c7361fdd1ba5046ea444e101ae15/asset_icons/ebc24b163bf1f58a9732a9a1d2faa5b2141b041d754ddc2260c5e76edfed261e.png'
        },
        {
            symbol: 'USDC',
            name: 'USD Coin',
            icon: 'https://dynamic-assets.coinbase.com/3c15df5e2ac7d4abbe9499ed9335041f00c620f28e8de2f93474a9f432058742cdf4674bd43f309e69778a26969372310135be97eb183d91c492154176d455b8/asset_icons/9d67b728b6c8f457717154b3a35f9ddc702eae7e76c4684ee39302c4d7fd0bb8.png'
        }
    ];

    let showCryptoDropdown = false;

    // Add click outside handler
    let dropdownRef: HTMLDivElement;
    
    function handleClickOutside(event: MouseEvent) {
        if (dropdownRef && !dropdownRef.contains(event.target as Node)) {
            showCryptoDropdown = false;
        }
    }

    function selectCrypto(crypto: Cryptocurrency) {
        selectedCrypto = crypto;
        showCryptoDropdown = false;
    }

    function openWithdrawModal() {
        showWithdrawModal = true;
    }

    function closeWithdrawModal() {
        showWithdrawModal = false;
        withdrawAddress = '';
        withdrawAmount = '';
    }

    function handleWithdraw() {
        // Handle withdrawal logic here
        console.log('Withdrawing:', {
            crypto: selectedCrypto,
            address: withdrawAddress,
            amount: withdrawAmount
        });
        closeWithdrawModal();
    }

    onMount(() => {
        // Simulate loading
        setTimeout(() => {
            isLoading = false;
        }, 1000);

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    });
</script>

{#if showWithdrawModal}
    <div class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl w-full max-w-lg shadow-xl" 
             in:fade={{ duration: 200 }}
             out:fade={{ duration: 150 }}>
            <!-- Modal Header -->
            <div class="flex items-center justify-between p-6 border-b border-gray-100">
                <h2 class="text-xl font-semibold text-gray-900">Withdraw</h2>
                <button 
                    class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    on:click={closeWithdrawModal}
                >
                    <svg class="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <!-- Modal Content -->
            <div class="p-6 space-y-6">
                <!-- Crypto Selection -->
                <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700">
                        Select Cryptocurrency
                    </label>
                    <div class="relative" bind:this={dropdownRef}>
                        <button 
                            type="button"
                            class="w-full flex items-center p-3 bg-white border border-gray-200 rounded-xl hover:border-[#3772FF] transition-colors"
                            on:click|stopPropagation={() => showCryptoDropdown = !showCryptoDropdown}
                        >
                            <img 
                                src={selectedCrypto.icon} 
                                alt={selectedCrypto.symbol} 
                                class="w-8 h-8 mr-3"
                            >
                            <div>
                                <div class="font-medium">{selectedCrypto.symbol}</div>
                                <div class="text-sm text-gray-500">{selectedCrypto.name}</div>
                            </div>
                            <svg 
                                class="w-5 h-5 ml-auto text-gray-400 transition-transform duration-200" 
                                class:rotate-180={showCryptoDropdown}
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor"
                            >
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {#if showCryptoDropdown}
                            <div 
                                class="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg"
                                transition:slide={{ duration: 200 }}
                                on:click|stopPropagation
                            >
                                <div class="py-2 max-h-60 overflow-y-auto">
                                    {#each cryptocurrencies as crypto}
                                        <button
                                            type="button"
                                            class="w-full flex items-center px-4 py-3 hover:bg-gray-50 transition-colors"
                                            class:bg-blue-50={selectedCrypto.symbol === crypto.symbol}
                                            on:click={() => selectCrypto(crypto)}
                                        >
                                            <img 
                                                src={crypto.icon} 
                                                alt={crypto.symbol} 
                                                class="w-8 h-8 mr-3"
                                            >
                                            <div>
                                                <div class="font-medium">{crypto.symbol}</div>
                                                <div class="text-sm text-gray-500">{crypto.name}</div>
                                            </div>
                                            {#if selectedCrypto.symbol === crypto.symbol}
                                                <svg class="w-5 h-5 ml-auto text-[#3772FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                                                </svg>
                                            {/if}
                                        </button>
                                    {/each}
                                </div>
                            </div>
                        {/if}
                    </div>
                </div>

                <!-- Address Input -->
                <div class="space-y-2">
                    <label for="address" class="block text-sm font-medium text-gray-700">
                        Address
                    </label>
                    <input 
                        type="text"
                        id="address"
                        bind:value={withdrawAddress}
                        placeholder="Enter withdrawal address"
                        class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#3772FF]/20 focus:border-[#3772FF] transition-colors"
                    >
                </div>

                <!-- Amount Input -->
                <div class="space-y-2">
                    <label for="amount" class="block text-sm font-medium text-gray-700">
                        Amount to withdraw
                    </label>
                    <div class="relative">
                        <input 
                            type="text"
                            id="amount"
                            bind:value={withdrawAmount}
                            placeholder="0.00"
                            class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#3772FF]/20 focus:border-[#3772FF] transition-colors"
                        >
                        <button 
                            class="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 text-sm text-[#3772FF] hover:bg-[#3772FF]/10 rounded-lg transition-colors"
                        >
                            Max Amount
                        </button>
                    </div>
                </div>

                <!-- Available Balance -->
                <div class="p-4 bg-green-50 rounded-xl border border-green-100">
                    <div class="flex justify-between text-sm">
                        <span class="text-gray-600">Available balance</span>
                        <span class="font-medium text-gray-900">0 BTC</span>
                    </div>
                    <div class="flex justify-between text-sm mt-1">
                        <span class="text-gray-600">Transaction fee</span>
                        <span class="font-medium text-gray-900">0.00011 BTC</span>
                    </div>
                </div>

                <!-- Daily Limit Warning -->
                <div class="p-4 bg-orange-50 rounded-xl border border-orange-100 text-sm text-orange-800">
                    $20,000.00 daily withdrawal limit.
                </div>
            </div>

            <!-- Modal Footer -->
            <div class="flex items-center justify-between p-6 border-t border-gray-100">
                <div class="text-sm text-gray-500">
                    Transaction fee: <span class="font-medium text-gray-900">0.00011 BTC</span>
                </div>
                <div class="flex gap-3">
                    <button 
                        class="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        on:click={closeWithdrawModal}
                    >
                        Cancel
                    </button>
                    <button 
                        class="px-4 py-2 bg-[#3772FF] text-white rounded-lg hover:bg-[#2952cc] transition-colors"
                        on:click={handleWithdraw}
                    >
                        Withdraw
                    </button>
                </div>
            </div>
        </div>
    </div>
{/if}

<div class="max-w-7xl mx-auto p-8 space-y-8">
    <!-- Header Section -->
    <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold text-gray-900">Wallet Overview</h1>
        <div class="flex items-center gap-2">
            <button class="btn-secondary">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
            </button>
            <div class="relative">
                <button class="btn-secondary">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                </button>
            </div>
        </div>
    </div>

    <!-- Total Balance Card -->
    <div class="balance-card">
        <div class="flex items-start justify-between">
            <div>
                <h2 class="text-xl font-semibold text-gray-800 mb-4">Total Balance</h2>
                <div class="flex items-baseline gap-2">
                    <span class="text-4xl font-bold tracking-tight">{totalBalance.btc}</span>
                    <div class="flex items-center gap-2">
                        <span class="px-3 py-1 bg-[#F7931A] text-white rounded-full text-sm font-medium">BTC</span>
                        <span class="text-green-500 text-sm font-medium">{totalBalance.change}</span>
                    </div>
                </div>
                <div class="text-lg text-gray-500 mt-1">{totalBalance.usd.toFixed(2)} USD</div>
            </div>
            <div class="flex gap-3">
                <button class="btn-primary" on:click={openWithdrawModal}>
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Withdraw
                </button>
                <button class="btn-secondary">
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l4-4m0 0l4 4m-4-4v12" />
                    </svg>
                    Deposit
                </button>
            </div>
        </div>
    </div>

    <!-- Balance Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Asset Balance Card -->
        <div class="balance-card hover:scale-[1.02] transition-transform">
            <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-xl bg-[#3772FF]/10 flex items-center justify-center">
                    <svg class="w-6 h-6 text-[#3772FF]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <div class="flex-1">
                    <div class="flex items-center justify-between">
                        <h3 class="text-lg font-medium text-gray-800">Asset Balance</h3>
                        <span class="text-green-500 text-sm font-medium">{assetBalance.change}</span>
                    </div>
                    <div class="flex items-center gap-2 mt-1">
                        <span class="font-semibold">{assetBalance.btc} BTC</span>
                        <span class="text-gray-500">{assetBalance.usd.toFixed(2)} USD</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Exchange Balance Card -->
        <div class="balance-card hover:scale-[1.02] transition-transform">
            <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-xl bg-[#3772FF]/10 flex items-center justify-center">
                    <svg class="w-6 h-6 text-[#3772FF]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                              d="M9 8h6m-5 0a3 3 0 110 6H9l3 3m-3-6h6m6 1a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <div class="flex-1">
                    <div class="flex items-center justify-between">
                        <h3 class="text-lg font-medium text-gray-800">Exchange Balance</h3>
                        <span class="text-green-500 text-sm font-medium">{exchangeBalance.change}</span>
                    </div>
                    <div class="flex items-center gap-2 mt-1">
                        <span class="font-semibold">{exchangeBalance.btc} BTC</span>
                        <span class="text-gray-500">{exchangeBalance.usd.toFixed(2)} USD</span>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Asset Balances Table -->
    <div class="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <div class="p-6 border-b border-gray-100">
            <div class="flex items-center justify-between">
                <h2 class="text-xl font-semibold text-gray-800">Asset Balances</h2>
                <div class="flex items-center gap-4">
                    <div class="flex items-center gap-2">
                        <input 
                            type="checkbox" 
                            id="hideZero" 
                            bind:checked={showZeroBalances}
                            class="checkbox"
                        />
                        <label for="hideZero" class="text-sm text-gray-600">Show zero balances</label>
                    </div>
                    <div class="relative">
                        <button class="btn-secondary">
                            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                            </svg>
                            Filter
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <table class="w-full">
            <thead>
                <tr class="border-b border-gray-100">
                    <th class="text-left py-4 px-6 text-sm font-medium text-gray-500">ASSET</th>
                    <th class="text-left py-4 px-6 text-sm font-medium text-gray-500">SYMBOL</th>
                    <th class="text-left py-4 px-6 text-sm font-medium text-gray-500">24H</th>
                    <th class="text-left py-4 px-6 text-sm font-medium text-gray-500">AVAILABLE BALANCE</th>
                    <th class="text-left py-4 px-6 text-sm font-medium text-gray-500">TOTAL BALANCE</th>
                </tr>
            </thead>
            <tbody>
                {#if totalBalance.btc === 0}
                    <tr>
                        <td colspan="5" class="py-16">
                            <div class="flex flex-col items-center justify-center text-gray-400">
                                <svg class="w-16 h-16 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" 
                                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                </svg>
                                <span class="text-lg">No results</span>
                            </div>
                        </td>
                    </tr>
                {/if}
            </tbody>
        </table>
    </div>
</div>

<style lang="postcss">
    .balance-card {
        @apply bg-white rounded-xl p-6 shadow-sm border border-gray-100;
    }

    .btn-primary {
        @apply flex items-center gap-2 px-6 py-2.5 bg-[#3772FF] text-white rounded-lg 
               hover:bg-[#2952cc] transition-all duration-200
               focus:outline-none focus:ring-2 focus:ring-[#3772FF]/20 focus:ring-offset-2;
    }

    .btn-secondary {
        @apply flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-700 rounded-lg 
               hover:bg-gray-100 transition-all duration-200
               focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-2;
    }

    .checkbox {
        @apply h-4 w-4 rounded border-gray-300 text-[#3772FF] 
               focus:ring-[#3772FF] transition-colors duration-200;
    }

    /* Loading skeleton animation */
    @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: .5; }
    }

    .animate-pulse {
        animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }

    /* Hover effects */
    .balance-card {
        @apply transition-all duration-200 hover:shadow-md;
    }

    /* Table styles */
    table {
        @apply w-full border-collapse;
    }

    th {
        @apply text-left py-4 px-6 text-sm font-medium text-gray-500 
               border-b border-gray-100 bg-gray-50;
    }

    td {
        @apply py-4 px-6 text-sm text-gray-700 border-b border-gray-100;
    }

    tr:hover td {
        @apply bg-gray-50;
    }
</style>
