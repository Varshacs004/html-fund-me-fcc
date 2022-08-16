import { ethers } from "./ethers-5.6.esm.min.js"
import { abi, contractAddress } from "./constants.js"

const connectButton = document.getElementById("connectButton")
const fundButton = document.getElementById("fundButton")
const withdrawButton = document.getElementById("withdrawButton")
const balanceButton = document.getElementById("balanceButton")

connectButton.onclick = connect
fundButton.onclick = fund
withdrawButton.onclick = withdraw
balanceButton.onclick = getBalance

console.log(ethers)

async function connect() {
  if (typeof window.ethereum !== "undefined") {
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" })
      console.log("Connected!!!")
    } catch (e) {
      console.log(e)
    }
    connectButton.innerHTML = "Connected!"
    const accounts = await ethereum.request({ method: "eth_accounts" })
    console.log(accounts)
  } else {
    console.log("Download a wallet...NOW!!!")
    connectButton.innerHTML = "Install a Wallet!!!"
  }
}

async function fund() {
  const ethAmount = document.getElementById("ethAmount").value
  console.log(`Funding with ${ethAmount}...`)
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(contractAddress, abi, signer)
    try {
      const transactionResponse = await contract.fund({
        value: ethers.utils.parseEther(ethAmount),
      })
      await listenForTransactionMine(transactionResponse, provider)
    } catch (e) {
      console.log(e)
    }
  } else {
    console.log("Download a wallet...NOW!!!")
    connectButton.innerHTML = "Install a Wallet!!!"
  }
}

async function withdraw() {
  console.log("Withdrawing...")
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(contractAddress, abi, signer)
    try {
      const transactionResponse = await contract.withdraw()
      await listenForTransactionMine(transactionResponse, provider)
    } catch (e) {
      console.log(e)
    }
  } else {
    console.log("Download a wallet...NOW!!!")
    connectButton.innerHTML = "Install a Wallet!!!"
  }
}

async function getBalance() {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    try {
      const balance = await provider.getBalance(contractAddress)
      console.log(ethers.utils.formatEther(balance))
    } catch (e) {
      console.log(e)
    }
  } else {
    console.log("Download a wallet...NOW!!!")
    connectButton.innerHTML = "Install a Wallet!!!"
  }
}

function listenForTransactionMine(transactionResponse, provider) {
  console.log(`Mining ${transactionResponse.hash}...`)
  return new Promise((resolve, reject) => {
    provider.once(transactionResponse.hash, (transactionReceipt) => {
      console.log(
        `Completed with ${transactionReceipt.confirmations} confirmations`
      )
      resolve()
    })
  })
}
