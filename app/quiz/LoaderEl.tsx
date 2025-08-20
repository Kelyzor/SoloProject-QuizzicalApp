import { Loader } from "lucide-react";
import { JSX } from "react";

export default function LoaderEl():JSX.Element {
    return (
        <div className="min-h-screen bg flex justify-center items-center">
            <Loader className="animate-spin w-20 h-20" />
        </div>
    )
}