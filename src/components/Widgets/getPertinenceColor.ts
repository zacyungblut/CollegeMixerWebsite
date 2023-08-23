export const getPertinenceColor = (pertinence: number) => {

    //Now a score from 0 through 10

    if (pertinence===1) {
        return "bg-gray-50 text-xs font-lighter"
    } else if (pertinence===2) {
        return "bg-zinc-50 text-xs font-lighter"

    } else if (pertinence===3) {
        return "bg-slate-100 text-xs font-lighter"
    } else if (pertinence===4) {
        return "bg-slate-200 text-xs font-lighter"
    } else if (pertinence===5) {
        return "bg-slate-300 text-xs font-lighter"
    } else if (pertinence===6) {
        return "bg-slate-400 text-white bg-opacity-80 text-xs font-lighter"
    } else if (pertinence===7) {
        return "bg-slate-500 text-white text-xs font-lighter"
    } else if (pertinence===8) {
        return "bg-slate-600 text-white text-xs font-lighter"

    } else if (pertinence===9) {
        return "bg-teal-700 text-white text-xs font-lighter"

    } else if (pertinence===10) {
        return "bg-emerald-700 text-white text-xs font-lighter"

    }

    return "bg-slate-100 text-xs font-lighter bg-opacity-"

}

const getGuidebarUnselectedColor = (pertinence: number) => {

    //Now a score from 0 through 10

    if (pertinence===1) {
        return "bg-gray-50 text-xs font-lighter"
    } else if (pertinence===2) {
        return "bg-zinc-50 text-xs font-lighter"

    } else if (pertinence===3) {
        return "bg-slate-100 text-xs font-lighter"
    } else if (pertinence===4) {
        return "bg-slate-200 text-xs font-lighter"
    } else if (pertinence===5) {
        return "bg-slate-300 text-xs font-lighter"
    } else if (pertinence===6) {
        return "bg-slate-400 text-white bg-opacity-80 text-xs font-lighter"
    } else if (pertinence===7) {
        return "bg-slate-500 text-white text-xs font-lighter"
    } else if (pertinence===8) {
        return "bg-slate-600 text-white text-xs font-lighter"

    } else if (pertinence===9) {
        return "bg-teal-700 text-white text-xs font-lighter"

    } else if (pertinence===10) {
        return "bg-emerald-700 text-white text-xs font-lighter"

    }

    return "bg-slate-100 text-xs font-lighter bg-opacity-"

}

const getGuidebarSelectedColor = (pertinence: number) => {

    //Now a score from 0 through 10

    if (pertinence===1) {
        return "bg-gray-50 text-xs font-lighter"
    } else if (pertinence===2) {
        return "bg-zinc-50 text-xs font-lighter"

    } else if (pertinence===3) {
        return "bg-slate-100 text-xs font-lighter"
    } else if (pertinence===4) {
        return "bg-slate-200 text-xs font-lighter"
    } else if (pertinence===5) {
        return "bg-slate-300 text-xs font-lighter"
    } else if (pertinence===6) {
        return "bg-slate-400 text-white bg-opacity-80 text-xs font-lighter"
    } else if (pertinence===7) {
        return "bg-slate-500 text-white text-xs font-lighter"
    } else if (pertinence===8) {
        return "bg-slate-600 text-white text-xs font-lighter"

    } else if (pertinence===9) {
        return "bg-teal-700 text-white text-xs font-lighter"

    } else if (pertinence===10) {
        return "bg-emerald-700 text-white text-xs font-lighter"

    }

    return "bg-slate-100 text-xs font-lighter bg-opacity-"

}


export const getCategoryColor = (category: number) => {

    //Now a score from 0 through 10
    if (category===4) {
        return "bg-gray-50 text-xs font-lighter hover:bg-gray-200"
    } else if (category===3) {
        return "bg-slate-400 text-white bg-opacity-80 text-xs font-lighter hover:bg-slate-500"
    } else if (category===2) {
        return "bg-slate-600 text-white text-xs font-lighter hover:bg-slate-700"
    } else if (category===1) {
        return "bg-emerald-700 text-white text-xs font-lighter hover:bg-emerald-800"
    }

    return "bg-slate-100 text-xs font-lighter hover:bg-slate-200"

}