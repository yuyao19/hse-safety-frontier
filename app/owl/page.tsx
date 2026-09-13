'use client';

import {useState} from 'react';

const basePath=process.env.NEXT_PUBLIC_BASE_PATH??'';

type Capsule={
  version:string;
  kdf:string;
  iterations:number;
  alg:string;
  salt_b64u:string;
  nonce_b64u:string;
  ciphertext_b64u:string;
  encoding:string;
};

function fromB64u(value:string){
  const padded=value.replace(/-/g,'+').replace(/_/g,'/')+'='.repeat((4-value.length%4)%4);
  const raw=atob(padded);
  return Uint8Array.from(raw,c=>c.charCodeAt(0));
}

async function decrypt(passphrase:string,capsule:Capsule){
  const enc=new TextEncoder();
  const baseKey=await crypto.subtle.importKey('raw',enc.encode(passphrase),'PBKDF2',false,['deriveKey']);
  const key=await crypto.subtle.deriveKey(
    {name:'PBKDF2',salt:fromB64u(capsule.salt_b64u),iterations:capsule.iterations,hash:'SHA-256'},
    baseKey,
    {name:'AES-GCM',length:256},
    false,
    ['decrypt']
  );
  const clear=await crypto.subtle.decrypt(
    {name:'AES-GCM',iv:fromB64u(capsule.nonce_b64u)},
    key,
    fromB64u(capsule.ciphertext_b64u)
  );
  return new TextDecoder(capsule.encoding||'utf-8').decode(clear);
}

export default function OwlPage(){
  const [code,setCode]=useState('NIGHT-OWL-2741');
  const [passphrase,setPassphrase]=useState('');
  const [status,setStatus]=useState('输入暗号与私人口令后，本页会在浏览器本地完成解密。');
  const [result,setResult]=useState('');
  const [busy,setBusy]=useState(false);

  async function run(){
    setBusy(true);setResult('');setStatus('正在获取密文胶囊…');
    try{
      const normalized=code.trim();
      if(!/^[A-Z0-9-]{4,64}$/.test(normalized))throw new Error('暗号格式无效');
      if(!passphrase)throw new Error('请输入私人口令');
      const res=await fetch(`${basePath}/owl/${normalized}.json`,{cache:'no-store'});
      if(!res.ok)throw new Error(`未找到暗号对应胶囊（HTTP ${res.status}）`);
      const capsule=await res.json() as Capsule;
      setStatus('密文已取得，正在本地解密…');
      const text=await decrypt(passphrase,capsule);
      setResult(text);
      setStatus('解密成功。口令仅在当前浏览器内使用，不会上传到服务器。');
    }catch(e){
      setStatus(e instanceof Error?`失败：${e.message}`:'解密失败');
    }finally{setBusy(false)}
  }

  return <main style={{maxWidth:760,margin:'0 auto',padding:'32px 18px 64px',fontFamily:'system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif',lineHeight:1.6}}>
    <section style={{border:'1px solid #d1d5db',borderRadius:18,padding:22}}>
      <p style={{margin:'0 0 6px',fontSize:13,opacity:.65}}>OWL CAPSULE v2 · 浏览器本地解密</p>
      <h1 style={{margin:'0 0 10px',fontSize:30}}>猫头鹰召唤台</h1>
      <p style={{margin:'0 0 24px',opacity:.78}}>公开网络只保存密文。暗号负责定位胶囊，私人口令负责解密。AES-256-GCM 与 PBKDF2-SHA256 均由浏览器 Web Crypto API 执行。</p>

      <label style={{display:'block',marginBottom:14}}>
        <span style={{display:'block',fontWeight:700,marginBottom:6}}>暗号</span>
        <input value={code} onChange={e=>setCode(e.target.value.toUpperCase())} autoCapitalize="characters" spellCheck={false} style={{width:'100%',boxSizing:'border-box',fontSize:16,padding:'12px 14px',border:'1px solid #9ca3af',borderRadius:10,background:'transparent',color:'inherit'}} />
      </label>

      <label style={{display:'block',marginBottom:18}}>
        <span style={{display:'block',fontWeight:700,marginBottom:6}}>私人口令</span>
        <input type="password" value={passphrase} onChange={e=>setPassphrase(e.target.value)} autoComplete="off" style={{width:'100%',boxSizing:'border-box',fontSize:16,padding:'12px 14px',border:'1px solid #9ca3af',borderRadius:10,background:'transparent',color:'inherit'}} />
      </label>

      <button type="button" disabled={busy} onClick={run} style={{minHeight:46,padding:'0 20px',border:0,borderRadius:10,fontWeight:800,fontSize:16,cursor:busy?'wait':'pointer'}}>{busy?'处理中…':'召唤 / 解密'}</button>

      <div aria-live="polite" style={{marginTop:20,padding:14,borderRadius:10,background:'rgba(127,127,127,.10)'}}>{status}</div>
      {result&&<div style={{marginTop:16,padding:18,border:'1px solid #9ca3af',borderRadius:12}}><div style={{fontSize:13,opacity:.65,marginBottom:8}}>已恢复内容</div><strong>{result}</strong></div>}
    </section>

    <section style={{marginTop:18,fontSize:14,opacity:.72}}>
      <p><b>工作原理：</b>页面根据暗号读取同域 <code>/owl/&lt;CODE&gt;.json</code>，用私人口令通过 PBKDF2-SHA256 派生 256 位密钥，再执行 AES-GCM 认证解密。</p>
      <p><b>边界：</b>这只是跨平台记忆胶囊原型。不要把真实企业敏感资料或生产密钥放入公开仓库。</p>
    </section>
  </main>;
}
