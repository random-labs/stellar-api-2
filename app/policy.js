const stellarSdk = require('stellar-sdk')
const stellarServer = new stellarSdk.Server(process.env.STELLAR_SERVER)

module.exports = {
    transaction: {
        destinationTrustsAsset: (publicKey, asset) => {
            return new Promise((resolve, reject) => {
                if (asset.code === 'XLM') {
                    resolve()
                }

                if (asset.issuer === publicKey) {
                    resolve()
                }

                stellarServer.loadAccount(publicKey)
                .then((destinationAccount) => {
                    let trusted = destinationAccount.balances.some((balance) => {
                        return (balance.asset_code === asset.code
                            && balance.asset_issuer === asset.issuer)
                    })

                    if (!trusted) {
                        throw new Error(
                            `The receiving account (${publicKey})
                            does not have a trustline for the asset.`
                        )
                    }

                    resolve()
                }).catch((err) => {
                    reject(err)
                })
            })
        }
    }
}