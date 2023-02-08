module.exports.setFlash=(req,res,next)=>{
    res.locals.flash={
        'success':req.flash('success'),
        'error':req.flash('error')  //another flash message key
    };
    next();
}