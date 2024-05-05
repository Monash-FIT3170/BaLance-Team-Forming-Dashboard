//external
import { useEffect, useState } from "react"
import { Avatar, Grid, GridItem, Link, Text} from '@chakra-ui/react'
//internal


export default function ContributorsPage(){
    const CONTRIBUTORS_FILE = "https://raw.githubusercontent.com/Monash-FIT3170/BaLance-Team-Forming-Dashboard/contributors_page/.all-contributorsrc"
    const [constributors,setContributors] = useState([])
    useEffect(()=>{
        fetch(CONTRIBUTORS_FILE,{
            method:"GET",
            mode:"cors",
            
        }
        ).then(response => response.json()).then(data=>{
            console.log(data.contributors)
            setContributors(data.contributors)
            
        },
    )
    },[]);

    return(
        <div className="Contributors-Page">
            <h1>Contributors Page</h1>
            <Grid gap={6}>
                {constributors.map((contributor)=> Contributor(contributor))}
            </Grid>
            
        </div>
    )
}
export  function Contributor(contributor){
    return (
        <GridItem w= '100%' h='auto'>
            <Avatar src = {contributor.avatar_url}/>
            <Link href={contributor.profile} >{contributor.name}</Link>
        </GridItem>
    )
}
