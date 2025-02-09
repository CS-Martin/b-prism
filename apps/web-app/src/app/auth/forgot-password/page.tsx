import { Input } from '@b-prism/shadcn-ui/index';

const ForgotPasswordPage = () => {
    return (
        <div className='flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 sm:mx-auto sm:w-full sm:max-w-sm'>
            <form action=''>
                <div>
                    <label
                        htmlFor='email'
                        className='block text-sm/6 font-medium'>
                        Email address
                    </label>
                    <div className='mt-2'>
                        <Input
                            id='email'
                            name='email'
                            type='email'
                            required
                            autoComplete='email'
                            className=''
                            // value={data.email}
                            // onChange={(e) =>
                            //     setData({
                            //         ...data,
                            //         email: e.target.value,
                            //     })
                            // }
                        />
                    </div>
                </div>
            </form>
        </div>
    );
};

export default ForgotPasswordPage;
