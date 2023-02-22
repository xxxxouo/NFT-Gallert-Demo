import React from 'react'
import { Etherscan} from '../../utils/index'

export const NFTCard = ({nft,copy}) => {
  return (
    <div className=' w-56  flex-col'>
      <div className=' rounded-xl overflow-hidden transform hover:scale-125 cursor-pointer duration-100'>
        <a target='_blank' href={nft.media[0].gateway}>
          <img className=' w-full' src={nft.media[0].gateway} alt="" />
        </a>
      </div>
      <div className='flex-col  bg-slate-100 rounded-xl px-2'>
        <h2 className=' font-bold '>{nft.title}</h2>
        <div className='flex justify-between text-sm'>
          <span>tokenId:</span>
          <p className=''>{nft.id.tokenId.substr(nft.id.tokenId.length -4,nft.id.tokenId.length)}</p>
        </div>
        <div className='flex justify-between text-sm'>
          <p className=' text-sm'>address:{nft.contract.address.slice(0,5)}...{nft.contract.address.slice(nft.contract.address.length - 4)}</p>
          <button onClick={()=>copy(nft.contract.address)} className=' bg-purple-500  text-white font-bold px-2 rounded-md'>cppy</button>
        </div>
        <div className=' flex justify-center mt-2'>
          <a className='bg-blue-500 w-3/4 text-center block px-2 py-1 rounded-md text-white text-sm' target='_blank' href={Etherscan(nft.contract.address)}>View on etherscan</a>
        </div>
      </div>
    </div>
  )
}
