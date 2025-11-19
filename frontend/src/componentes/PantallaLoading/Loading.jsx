// import { useContext } from 'react'
// import { LoadingContext } from '../useContext/LoadingContext';

export default function Loading() {

    // const { Loading } = useContext(LoadingContext)

    return (
        <section className='absolute inset-0 z-50 bg-black/50'>
            <article className='h-dvh w-dvw'>
                <div className='h-full w-full flex items-center justify-center'>
                    <p className='h-20 w-20 border-4 border-sky-700 border-t-sky-400 rounded-full animate-spin'></p>
                </div>
            </article>
        </section>
    )
}
