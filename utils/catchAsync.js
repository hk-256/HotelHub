module.exports = function(func){
    return (req,res,next)=>{
        // console.log("inside catchAsync");
        func(req,res,next).catch((err)=>{
            next(err);
        });
    }
}