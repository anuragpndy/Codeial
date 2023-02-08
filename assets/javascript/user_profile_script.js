if(document.getElementById('current_user_form'))
{
    btn_preview.onclick=function(e){
        if(!(imgInp.files[0])  ){
            alert('Please select a image first ... !');
            return false
        }
        blah.src =  URL.createObjectURL(imgInp.files[0]); //URL.createObjectURL()  static method creates a DOMString containing a URL representing the object given in the parameter.   
        blah.style.width="150px";
        blah.style.height="200px";
        preview_container.style.display="block";
    };
    close_preview.onclick=function(e){
        preview_container.style.display="none";
    }
}

$('#toggle_friendship').click(function(e){
    let self=this;
    e.preventDefault();
    $.ajax({
        type:'POST',
        url:$(self).attr('href')
    })
    .done(function(data){
        if(data.data.added==true){
            new Noty({
                theme: 'relax',
                text: "Friend Added!",
                type: 'success',
                layout: 'topRight',
                timeout: 1500
            }).show();    
            $(self).text('Remove Friend')
        }
        else{
            new Noty({
                theme: 'relax',
                text: "Friend Removed!",
                type: 'success',
                layout: 'topRight',
                timeout: 1500
            }).show();
            $(self).text('Add Friend')
        }
    })
    .fail(function(errData) {
        console.log('error in completing the request',errData);
    });
});