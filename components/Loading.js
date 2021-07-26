import { Circle } from 'better-react-spinkit';

export default function Loading() {
    return (
        <center style={{height:"100vh",display: "grid",placeItems: "center"}}>
            <div>
                <img src="http://assets.stickpng.com/images/580b57fcd9996e24bc43c543.png" 
                    height={200}
                    alt="Loading ...."
                    style={{ marginBottom: "10px" }}
                />
                <Circle color="#3CBC28" size={60} />
            </div>
        </center>
    )
}
