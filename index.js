    import express from "express";
    import axios from "axios";
    import bodyParser from "body-parser";
    import env from "dotenv";

    env.config();

    const port = process.env.PORT || 3000;

    const app = express();

    const URL = process.env.API_URL;

    const apiKey = process.env.API_KEY;

    app.use(express.static("public"));
    app.use(bodyParser.urlencoded({extended : true}));

    app.get("/",(req,res)=>{
        res.render("index.ejs",{lat:null ,long:null});
    });

    app.post("/", async (req,res)=>{
    
    try{
        const response = await axios.get(URL,{
        params:{
            lat:req.body.latitude,
            lon:req.body.longnitude,
            appid:apiKey,
            units: "metric"
        }
        });
        const result = response.data;   
        const icon = result.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

        const options = {
            hour:"2-digit",
            minute:"2-digit",
            second:"2-digit",
            hour12:true,
            timeZone:"Asia/Kolkata"
        }

        const rise = new Date(result.sys.sunrise * 1000).toLocaleTimeString("en-IN",options);
        const set = new  Date(result.sys.sunset * 1000).toLocaleTimeString("en-IN",options);

        const update = new Date(result.dt * 1000).toLocaleString("en-IN",{
            dateStyle:"medium",
            timeStyle:"medium",
            timeZone:"Asia/kolkata"
        });
        res.render("index.ejs",{data:result,icon:iconUrl,sunrise:rise,sunset:set,updated:update,lat:result.coord.lat,long:result.coord.lon});
    }catch(error){
        res.send("Invalid API or request failed");
    }
    });
    app.listen(port,()=>{
        console.log(`Server is running on port:${port}`);
    });