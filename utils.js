const setResponse = (res,status,msg,data)=>{
    switch(status){
        case 200:
            return res.staus(status).json({
                success : true,
                msg,
                data
            })
        default :
            return res.status(status).json({
                success :false,
                msg
            })
    }}


 module.exports = {setResponse}
