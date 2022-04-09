let generate = (i, dim) => {
    if (i>1){
            for(let d=0; d<8;d++)
                dim.push(generate(i-1,[]))
        }
    else
        for(let d=0; d<8;d++)
            dim.push('0000000000000000')

    return dim
}

let data = dimensions => {
    return generate(dimensions, [])
}

module.exports = data