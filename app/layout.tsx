import type { Metadata } from 'next';
import './globals.css';
const basePath=process.env.NEXT_PUBLIC_BASE_PATH??'';
export const metadata:Metadata={title:'安全边界 · HSE守护者',description:'与安禾、永勋、凌曜和观微一起识别危险、控制源头、安全突围。',manifest:`${basePath}/manifest.webmanifest`,applicationName:'安全边界',appleWebApp:{capable:true,statusBarStyle:'black-translucent',title:'安全边界'},icons:{icon:`${basePath}/favicon.svg`,apple:`${basePath}/icons/apple-touch-icon.png`}};
export const viewport={width:'device-width',initialScale:1,maximumScale:1,userScalable:false,viewportFit:'cover',themeColor:'#0c1b25'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="zh-CN"><body>{children}</body></html>}
