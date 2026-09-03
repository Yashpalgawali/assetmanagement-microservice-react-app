import { Typography } from "@mui/material";

export default function ErrorComponent (){
    return(
        <div className="container">
            <Typography variant="h3">No Page found</Typography>
            <Typography variant="h6">Oops page does not exists</Typography>
        </div>
    )
}