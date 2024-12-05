import { options } from '../api/auth/[...nextauth]/options';
import { getServerSession } from 'next-auth';
import Spline from '@splinetool/react-spline';
import Link from 'next/link';

import { Button } from '@b-prism/shadcn-ui/index';

export default async function Dashboard() {
    const session = await getServerSession(options);

    return (
        <div className=''>
            <section className='relative h-[100vh]'>
                <Spline
                    className='w-full h-[100vh]'
                    scene='https://prod.spline.design/ng-ni62YpZyz95ES/scene.splinecode'
                />
                <div className='absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center'>
                    <p className='text-white text-[139px] font-thunderblack-lc leading-[120px]'>
                        <span className='font-thunderthin-hc'>PROJECT</span> HARIBON
                    </p>
                    <p className='text-white text-[22px] text-center leading-[30px]'>
                        Hazard Assessment and Rescue Integration for <br /> Bicol Operations Network
                    </p>
                    <Button className='mt-8 p-6'>Start Contributing Now!</Button>
                </div>
            </section>

            {session?.user ? (
                <div>
                    <p>Hi {session.user.email}</p>
                </div>
            ) : (
                <p>User not logged in</p>
            )}

            <Button>Button</Button>

            <Link href='/admin/dashboard'>Admin Dashboard</Link>
            <Link href='/auth/register'>Register</Link>
            <Link href='/auth/login'>Login</Link>
            <Link href='/api/auth/signout'>Logout</Link>
        </div>
    );
}
