function AnimateBox() {
    return (
        <div className="grid grid-cols-3 h-5/6 aspect-square place-items-center burp-container gap-2">
            <span className="aspect-square h-full bg-indigo-400 rounded-xl animate-pulse"></span>
            <span className="aspect-square h-full bg-indigo-400 rounded-xl burping"></span>
            <span className="aspect-square h-full bg-indigo-400 rounded-xl animate-pulse"></span>
            <span className="aspect-square h-full bg-indigo-400 rounded-xl burping"></span>
            <span className="aspect-square h-full bg-indigo-400 rounded-xl animate-pulse"></span>
            <span className="aspect-square h-full bg-indigo-400 rounded-xl burping"></span>
            <span className="aspect-square h-full bg-indigo-400 rounded-xl animate-pulse"></span>
            <span className="aspect-square h-full bg-indigo-400 rounded-xl burping"></span>
            <span className="aspect-square h-full bg-indigo-400 rounded-xl animate-pulse"></span>
        </div>
    );
}
export default AnimateBox;
