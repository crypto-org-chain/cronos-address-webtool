<template>
  <div :class="{'tools-container': isPc, 'tools-container-mb': !isPc}">
    <div class="body">
      <div class="tools-convert-addr tool">
        <p class="tips">Convert address</p>
        <a-textarea
            class="address-input input"
            placeholder="Please enter your address here."
            v-model="address"
            spellcheck="false"
            :auto-size="{ minRows: 1, maxRows: 6 }"
        />
        <div class="btn-container">
          <div class="btn" @click="convertAddress">
            <span v-if="!loading">Convert</span>
            <a-icon v-if="loading" type="loading"/>
          </div>
        </div>

        <div class="result-detail">
          <div class="address">eth: {{ ethAddress }}</div>
        </div>
        <div class="result-detail">
          <div class="address">crc: {{ crcAddress }}</div>
        </div>
<!--        <div class="result-detail">-->
<!--          <div class="address">cro: {{ croAddress }}</div>-->
<!--        </div>-->
        <div class="result-detail">
          <div class="address">tcrc: {{ tcrcAddress }}</div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
let {bech32} = require('bech32')
const sdk = require("@crypto-org-chain/chain-jslib");
export default {
  name: 'HelloWorld',
  data() {
    return {
      isPc: this.$isPc(),
      address: '',
      ethAddress: '',
      crcAddress: '',
      croAddress: '',
      tcrcAddress: '',
      loading: false,

    }
  },
  props: {
    msg: String
  },
  mounted() {
  },
  methods: {
    convertAddress() {
      if (this.address.length <= 0) {
        return
      }

      try {
        if(this.address.startsWith('tcrc') || this.address.startsWith('tcro') || this.address.startsWith('cro') || this.address.startsWith('crc') || this.address.startsWith('ethm')) {
          const decodeData = bech32.decode(this.address)
          const words = bech32.fromWords(decodeData.words)
          const toHexString = bytes =>
              bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');
          this.ethAddress = this.toChecksumAddress(toHexString(new Uint8Array(words)))
          this.crcAddress = bech32.encode('crc', decodeData.words);
          this.croAddress = bech32.encode('cro', decodeData.words);
          this.tcrcAddress = bech32.encode('tcrc', decodeData.words);
        } else {
          this.ethAddress = this.address.startsWith('0x')? this.address: `0x${this.address}`
          this.crcAddress = sdk.utils.convertEVMAddressToBech32Address(this.address, 'crc')
          this.croAddress = sdk.utils.convertEVMAddressToBech32Address(this.address, 'cro')
          this.tcrcAddress = sdk.utils.convertEVMAddressToBech32Address(this.address, 'tcrc')
        }
      } catch (e) {
        this.$message.info(`${e}`);
      }
    },
    toChecksumAddress(address) {
      const createKeccakHash = require('keccak')
      address = address.toLowerCase().replace('0x', '')
      let hash = createKeccakHash('keccak256').update(address).digest('hex')
      let ret = '0x'

      for (let i = 0; i < address.length; i++) {
        if (parseInt(hash[i], 16) >= 8) {
          ret += address[i].toUpperCase()
        } else {
          ret += address[i]
        }
      }

      return ret
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
  div {
    display: flex;
    flex-direction: column;
  }
  .tools-container {
    width: 100%;
    height: 100%;
    align-items: center;

    .header {
      flex-direction: row;
      padding: 16px;
      height: fit-content;
      justify-content: space-around;
    }

    .body {
      margin-top: 120px;
      .btn {
        cursor: pointer;
        height: 38px;
        font-size: 18px;
        background-color: #F5EF55;
        border-radius: 16px;
        justify-content: center;
        padding: 20px;
        box-shadow: rgba(0, 0, 0, .08) 0px 6px 10px;

        &:hover {
          background-color: #EAE452;
        }
      }
      .tool {
        padding: 8px;
        background-color: #fff;
        border-radius: 24px;
        width: 480px;
        height: fit-content;
        box-shadow: rgba(0, 0, 0, .01) 0px 0px 1px, rgba(0, 0, 0, .04) 0px 4px 8px, rgba(0, 0, 0, .04) 0px 16px 24px, rgba(0, 0, 0, .01) 0px 24px 32px;

        .tips {
          font-size: 16px;
          font-weight: 500;
          padding: 16px 20px 8px 20px;
        }

        .input {
          padding: 10px;
          flex-direction: row;
          width: 100%;
          justify-content: space-between;
          background-color: rgb(247, 248, 250);
          border-radius: 20px;
          border: 1px solid rgb(237, 238, 242);
        }

        .btn-container {
          width: 100%;
          flex-direction: row;
          justify-content: flex-end;
          .btn {
            width: fit-content;
            margin: 10px;
          }
        }

        .result-detail {
          margin-top: 8px;
          background-color: rgb(247, 248, 250);
          border-radius: 20px;
          border: 1px solid rgb(237, 238, 242);

          .address {
            border-radius: 20px;
            padding: 16px 20px 16px 20px;
          }

          .operates {
            flex-direction: row;
            justify-content: space-between;
            padding: 8px;
            align-items: center;

            .qr-code {
              font-size: 20px;
              margin-left: 12px;
              cursor: pointer;
            }

            .copy {
              cursor: pointer;
              height: 38px;
              font-size: 18px;
              background-color: #F5EF55;
              border-radius: 16px;
              justify-content: center;
              padding: 20px;
              box-shadow: rgba(0, 0, 0, .08) 0px 6px 10px;

              &:hover {
                background-color: #EAE452;
              }
            }
          }
        }
      }


      .tools-convert-addr {

        .path-input {
          margin-top: 10px;
        }



      }

    }

  }

  .tools-container-mb {
    width: 100%;
    height: fit-content;
    align-items: center;

    .header {
      flex-direction: row;
      padding: 16px;
      height: fit-content;
      justify-content: space-around;

    }

    .body {
      margin-top: 2.267rem  /* 170/75 */;
      width: 96%;
      .btn {
        cursor: pointer;
        height: 0.813rem  /* 61/75 */;
        font-size: 0.307rem  /* 23/75 */;
        background-color: #F5EF55;
        border-radius: 0.32rem  /* 24/75 */;
        justify-content: center;
        padding: 0.413rem  /* 31/75 */;
        box-shadow: rgba(0, 0, 0, .08) 0 0.08rem  /* 6/75 */ 0.133rem  /* 10/75 */;

        &:hover {
          background-color: #EAE452;
        }
      }
      .tool {
        padding: 0.187rem  /* 14/75 */;
        background-color: #fff;
        border-radius: 0.507rem  /* 38/75 */;
        width: 100%;
        height: fit-content;
        box-shadow: rgba(0, 0, 0, .01) 0 0 1px, rgba(0, 0, 0, .04) 0 0.053rem  /* 4/75 */ 0.107rem  /* 8/75 */, rgba(0, 0, 0, .04) 0 0.213rem  /* 16/75 */ 0.32rem  /* 24/75 */, rgba(0, 0, 0, .01) 0 0.32rem  /* 24/75 */ 0.427rem  /* 32/75 */;

        .tips {
          font-size: 0.32rem  /* 24/75 */;
          font-weight: 500;
          padding: 0.213rem  /* 16/75 */ 0.267rem  /* 20/75 */ 0.107rem  /* 8/75 */ 0.267rem  /* 20/75 */;
        }

        .input {
          padding: 0.24rem  /* 18/75 */;
          flex-direction: row;
          width: 100%;
          justify-content: space-between;
          background-color: rgb(247, 248, 250);
          border-radius: 0.413rem  /* 31/75 */;
          border: 1px solid rgb(237, 238, 242);
        }

        .btn-container {
          width: 100%;
          flex-direction: row;
          justify-content: flex-end;
          .btn {
            width: fit-content;
            margin: 0.227rem  /* 17/75 */;
          }
        }

        .result-detail {
          margin-top: 0.173rem  /* 13/75 */;
          background-color: rgb(247, 248, 250);
          border-radius: 0.413rem  /* 31/75 */;
          border: 1px solid rgb(237, 238, 242);

          .address {
            border-radius: 0.413rem  /* 31/75 */;
            padding: 0.32rem  /* 24/75 */ 0.413rem  /* 31/75 */ 0.16rem  /* 12/75 */ 0.413rem  /* 31/75 */;
            font-size: 0.32rem  /* 24/75 */;

          }

          .operates {
            flex-direction: row;
            justify-content: space-between;
            padding: 0.16rem  /* 12/75 */;
            align-items: center;

            .qr-code {
              font-size: 0.413rem  /* 31/75 */;
              margin-left: 0.253rem  /* 19/75 */;
              cursor: pointer;
            }

            .copy {
              cursor: pointer;
              height: 0.813rem  /* 61/75 */;
              font-size: 0.307rem  /* 23/75 */;
              background-color: #F5EF55;
              border-radius: 0.32rem  /* 24/75 */;
              justify-content: center;
              padding: 0.413rem  /* 31/75 */;
              box-shadow: rgba(0, 0, 0, .08) 0 0.08rem  /* 6/75 */ 0.133rem  /* 10/75 */;

              &:hover {
                background-color: #EAE452;
              }
            }
          }
        }
      }


      .tools-convert-addr {

        .path-input {
          margin-top: 10px;
        }

      }

    }
  }
</style>
