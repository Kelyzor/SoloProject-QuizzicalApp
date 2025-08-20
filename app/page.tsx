import Link from "next/link"

export default function StartMenu() {
    return (
        <main className="min-h-screen p-[50px] lg:p-[200px] bg flex flex-col justify-center items-center">
            <h1 className="font-bold text-[2em]">Quizzical</h1>
            <p className="font-normal text-center mt-2 lg:mt-10">Test your knowledge and challenge yourself with fun questions!</p>
            <Link href="/quiz" className="mt-7 lg:mt-12"><button className="pt-2 pb-2 pr-7 pl-7 lg:pt-4 lg:pb-4 lg:pr-14 lg:pl-14 cursor-pointer hover:bg-[#414d8a] active:scale-95 active:duration-100 font-inter bg-[#4D5B9E] rounded-2xl text-[#F5F7FB] font-medium">Start quiz</button></Link>
        </main>
    )
}