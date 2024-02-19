'use client'
import { NavBar, type NavBarProps } from 'antd-mobile'
import { useRouter } from 'next/navigation'


export default function PageHeader(props: NavBarProps) {
    const router = useRouter()

    return <NavBar {...props}  className='sticky top-0 bg-slate-100' onBack={router.back}>{props.children}</NavBar>
}