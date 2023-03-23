export function shuffle(array : any[]) {
    const clonedArray = [ ...array ]

    for(let index = clonedArray.length - 1; index > 0; index--) {
        const randomIndex =  Math.floor(Math.random() * (index + 1));
        // Swap elements with destructuring syntax
        [clonedArray[index], clonedArray[randomIndex]] = [clonedArray[randomIndex], clonedArray[index]]
    }

    return clonedArray
}

export const excludePassword = {
    select: {
        avatarUrl: true, lastViewedTags: true, username: true, id: true
    }
}