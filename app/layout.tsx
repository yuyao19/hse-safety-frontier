import type { Metadata } from 'next';
import './globals.css';
const basePath=process.env.NEXT_PUBLIC_BASE_PATH??'';
export const metadata:Metadata={title:'安全边界 · 风险连连看',description:'与安禾、永勋、凌曜和观微一起连接线索、匹配措施，让工程施工与生产现场恢复安全。',manifest:`${basePath}/manifest.webmanifest`,applicationName:'风险连连看',appleWebApp:{capable:true,statusBarStyle:'black-translucent',title:'风险连连看'},icons:{icon:`${basePath}/favicon.svg`,apple:`${basePath}/icons/apple-touch-icon.png`}};
export const viewport={width:'device-width',initialScale:1,maximumScale:1,userScalable:false,viewportFit:'cover',themeColor:'#0c1b25'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="zh-CN"><body>{children}</body></html>}
