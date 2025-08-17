export default function StartMenu(props) {
    return (
        <main className="min-h-screen bg flex flex-col justify-center items-center">
            <h1 className="font-bold text-[2rem]">Quizzical</h1>
            <p className="font-normal mt-2">Some description if needed</p>
            <button onClick={props.toggleQuiz} className="pt-4 pb-4 pr-14 pl-14 cursor-pointer hover:bg-[#414d8a] active:scale-95 active:duration-100 font-inter bg-[#4D5B9E] rounded-2xl text-[#F5F7FB] mt-[1.875rem] font-medium">Start quiz</button>
        </main>
    )
}