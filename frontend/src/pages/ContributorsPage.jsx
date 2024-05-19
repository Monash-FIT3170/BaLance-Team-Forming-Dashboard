
//external
import { useEffect, useState } from "react"
import { Avatar, Box, Grid, GridItem, Heading, Link, Text, Wrap, WrapItem } from '@chakra-ui/react'
//internal

/*
Contributors page: used to display the contributions 
*/
export default function ContributorsPage() {
    //link to the contributions file. Need to confirm that this is best practice
    const CONTRIBUTORS_FILE = "https://raw.githubusercontent.com/Monash-FIT3170/BaLance-Team-Forming-Dashboard/contributors_page/.all-contributorsrc"
    //contributors are a state variable so they are automatically updated when they are changed 
    const [contributors, setContributors] = useState([])
    useEffect(() => {
        fetch(CONTRIBUTORS_FILE, {
            method: "GET",
            mode: "cors",//need this to pass header check

        }
        ).then(response => response.json()).then(data => {//convert response to json then set the state variable to the json 
            setContributors(data.contributors)

        },
        )
    }, []);//useEffect hook that has no dependency. Used to fetch the allconstributors file on page load and update the contributors state variable 

    return (
        <Box paddingInline={'2rem'} marginBottom={'4rem'}>
            <Heading>Contributors Page</Heading>
            <Grid gap={6}>
                {Object.keys(contributors).map((year)=> YearBlock(year,contributors[year]))}
            </Grid>

        </Box>
    )
}
export function YearBlock(year, contributors){
    return(
        <Box paddingInline={'2rem'} marginBottom={'4rem'}>
            <Heading>{year}</Heading>
            <Grid templateColumns={'repeat(auto-fit, minmax(250px, 1fr))'} gap={6}>
                {contributors.map((contributor) => Contributor(contributor))}
            </Grid>

        </Box>
    )
}
/*'
Contributors Component
Takes a contributor object in the format of the allcontributors guide and fits it into a neat component. 
*/
export function Contributor(contributor) {
    //TODO: Need a better way to do this
    const emojiKey = {
        "audio": "🔊",
        "a11y": "♿️",
        "bug": "🐛",
        "blog": "📝",
        "business": "💼",
        "code": "💻",
        "content": "🖋",
        "data": "🔣",
        "doc": "📖",
        "design": "🎨",
        "example": "💡",
        "eventOrganizing": "📋",
        "financial": "💵",
        "fundingFinding": "🔍",
        "ideas": "🤔",
        "infra": "🚇",
        "maintenance": "🚧",
        "mentoring": "🧑‍🏫",
        "platform": "📦",
        "plugin": "🔌",
        "projectManagement": "📆",
        "promotion": "📢",
        "question": "💬",
        "research": "🔬",
        "review": "👀",
        "security": "🛡️",
        "tool": "🔧",
        "translation": "🌐",
        "test": "⚠️",
        "tutorial": "✅",
        "talk": "📢",
        "userTesting": "📓",
        "video": "📹",
        "team1": "1️⃣",
        "team2": "2️⃣",
        "team2": "3️⃣",
        "releaseTrainEngineer": "🚂",
        "systemArchitect": "🏛️",
    }
    //TODO: Add some better styling
    return (
        <GridItem p={4} boxShadow={'md'}>
            <Grid templateRows='repeat(2, 1fr)'templateColumns='repeat(2, 1fr)' justifyItems={'center'}>
                <GridItem rowSpan={2} colSpan={1}>
                    <Avatar src={contributor.avatar_url} />
                </GridItem>
                <GridItem colSpan={1} isTruncated>
                    <Link href={contributor.profile} >{contributor.name}</Link>
                </GridItem>
                <GridItem colSpan={1}>
                    {contributor.contributions.map((contributionType,index) => emojiKey[contributionType])}
                </GridItem>
            </Grid>            
        </GridItem>
    )
}

