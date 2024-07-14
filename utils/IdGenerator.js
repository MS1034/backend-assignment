function*  uniqueIdGenerator(id = 1)
{
    while(true)
    {
        yield id++
    }
}

const idGenerator = uniqueIdGenerator()

export default idGenerator;