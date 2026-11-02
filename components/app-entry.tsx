'use client';
import {useEffect,useState} from 'react';
import Stride from './stride';
import PublicPost from './public-post';
import {SHARE_ID} from '../lib/share-post';
export default function AppEntry(){const [id,setId]=useState<string|null|undefined>(undefined);useEffect(()=>{const value=new URLSearchParams(window.location.search).get('post');setId(value?(SHARE_ID.test(value)?value:'invalid'):null)},[]);if(id===undefined)return <div className="app-starting" role="status">stride<span>One small step…</span></div>;return id?<PublicPost id={id}/>:<Stride/>}
