import Head from 'next/head'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { Base_URL,Base_URL_Collection } from '../utils'
import { NFTCard } from './components/NFTCard'
import useIntersectionObserver from './hooks/useIntersectionObserver';

const options = {method: 'GET'};

const Home = () => {
  const [firstCome, setFirstCome] = useState(true)
  const [walletAddress ,setWalletAddress] = useState("")
  const [collectionAddress,setCollectionAddress ] = useState("")
  const [NFTs, setNFTs] = useState([])
  const [fetchForCollection, setFetchForCollection ] = useState(false)
  const [isLast, setIsLast] = useState(false);
  const [startToken, setStartToken] = useState(0)
  const [limit, setLimit] = useState(50)
  const [pageKey, setPageKey] = useState('')
  const { observerRef, isIntersecting } = useIntersectionObserver();

  const fetchNFTs = async(e) =>{
    if(firstCome) setFirstCome(false)
    if(e == 1) {
      setPageKey("")
      setIsLast(false)
      setNFTs([])
    }
    if(!collectionAddress.length){
      try {
        const res = await fetch(`${Base_URL(process.env.NEXT_PUBLIC_API_KEY)}?owner=${walletAddress}&pageKey=${pageKey}&pageSize=${limit}`, options)
        if(res.ok){
          const {ownedNfts,pageKey}  = await res.json();
          const isLast = ownedNfts.length < limit
          if(isLast){
            setPageKey("")
          }else{
            setPageKey(pageKey)
          }
          setIsLast(isLast)
          setNFTs([...NFTs,...ownedNfts])
        }
      } catch (error) {
        console.log(error);
      }
      
    } else {
      try {
        const res = await fetch(`${Base_URL(process.env.NEXT_PUBLIC_API_KEY)}?owner=${walletAddress}&contractAddresses%5B%5D=${collectionAddress}&pageKey=${pageKey}&pageSize=${limit}`, options)
        if(res.ok){
          const {ownedNfts,pageKey}  = await res.json();
          const isLast = ownedNfts.length < limit
          if(isLast){
            setPageKey("")
          }else{
            setPageKey(pageKey)
          }
          setIsLast(isLast)
          setNFTs(ownedNfts)
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  const fetchNFTsForCollection = async(e) =>{
    if(firstCome) setFirstCome(false)
    if(e == 1) {
      setStartToken(0)
      setIsLast(false)
      setNFTs([])
    }
    if(collectionAddress.length){
      try {
        const res = await fetch(`${Base_URL_Collection(process.env.NEXT_PUBLIC_API_KEY)}?contractAddress=${collectionAddress}&withMetadata=true&startToken=${startToken}&limit=${limit}`, options)
        if(res.ok){
          const { nfts }  = await res.json();
          setIsLast(()=>{
            return nfts.length < limit?true:false
          })
          setNFTs([...NFTs,...nfts])
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  const copy = (text) =>{
    var textareaC = document.createElement('textarea');
    textareaC.setAttribute('readonly', 'readonly');
    textareaC.value = text;
    document.body.appendChild(textareaC);
    textareaC.select();
    var res = document.execCommand('copy');
    document.body.removeChild(textareaC);
    return res;
  }

  useEffect(()=>{
    if (isIntersecting  && !isLast && !firstCome) {
      setStartToken((pre)=>pre + limit )
      fetchForCollection? fetchNFTsForCollection():fetchNFTs()
    }
  },[isIntersecting,firstCome])
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <h1 className=' mb-5'>Author: 洁神 </h1>
      <div className='flex flex-col gap-2'>
        {
          !fetchForCollection &&
          <input type="text" className=' bg-gray-200 border border-solid border-purple-400 rounded-md py-1 px-2 w-96' onChange={e=> setWalletAddress(e.target.value)} value={walletAddress} placeholder='Add your wallet address' />
        }
        <input type="text" className=' bg-gray-200 border border-solid border-green-400 rounded-md py-1 px-2 w-96' onChange={e=> setCollectionAddress(e.target.value)} value={collectionAddress} placeholder='Add the collection address' />
        <div className='flex justify-between items-center'>
          <label><input onChange={e=> setFetchForCollection(e.target.checked)} type="checkbox" />Fetch for collection</label>
          <button className=' bg-blue-400 rounded-xl p-2 text-white ' onClick={fetchForCollection?()=> fetchNFTsForCollection(1):()=>fetchNFTs(1) }>Search</button>
        </div>
      </div>
      <div className=' mt-4 grid grid-cols-1 gap-6  md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
        {
          NFTs?.length && NFTs?.map((nft,idx) =>{
            return (
              <NFTCard key={idx} copy={copy} nft={nft}/>
            )
          })
        }
      </div>
      <div ref={observerRef}/>
    </div>
  )
}

export default Home
