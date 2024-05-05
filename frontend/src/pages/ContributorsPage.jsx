//external
import { useEffect, useState } from "react"
import { Avatar, Box, Grid, GridItem, Link, Text, Wrap, WrapItem} from '@chakra-ui/react'
//internal

/*
Contributors page: used to display the contributions 
*/
export default function ContributorsPage(){
    //link to the contributions file. Need to confirm that this is best practice
    const CONTRIBUTORS_FILE = "https://raw.githubusercontent.com/Monash-FIT3170/BaLance-Team-Forming-Dashboard/contributors_page/.all-contributorsrc"
    //contributors are a state variable so they are automatically updated when they are changed 
    const [constributors,setContributors] = useState([])
    useEffect(()=>{
        fetch(CONTRIBUTORS_FILE,{
            method:"GET",
            mode:"cors",//need this to pass header check
            
        }
        ).then(response => response.json()).then(data=>{//convert response to json then set the state variable to the json 
            setContributors(data.contributors)
            
        },
    )
    },[]);//useEffect hook that has no dependency. Used to fetch the allconstributors file on page load and update the contributors state variable 

    return(
        <div className="Contributors-Page">
            <h1>Contributors Page</h1>
            <Wrap>
                {constributors.map((contributor)=> Contributor(contributor))}
            </Wrap>
            
        </div>
    )
}
/*'
Contributors Component
Takes a contributor object in the format of the allcontributors guide and fits it into a neat component. 
*/
export  function Contributor(contributor){
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
        "video": "📹"        
    }
    //TODO: Add some better styling
    return (
        <WrapItem p={4} boxShadow={'md'}>
            <Box textAlign={"center"}>
                <Avatar src = {contributor.avatar_url}/>
                <Link href={contributor.profile} >{contributor.name}</Link>
            </Box>
            <Box textAlign={'center'}>
                {contributor.contributions.map((contributionType)=> emojiKey[contributionType])}

            </Box>
        </WrapItem>
    )
}
