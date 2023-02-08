{
    //method to submit the form data for new post using ajax
    let createPost=()=>{
        let newPostForm=$('#new-post-form');
        newPostForm.submit(function(e){
            e.preventDefault();             //stopping default behaviour so ajax will post the form data in JSON
            $.ajax({
                url:'/posts/create',
                type:'POST',
                data:newPostForm.serialize(),       //serize will convert data into json
                success:function(data){
                    let newPost=newPostDOM(data.data.post);
                    $('#posts-list-container>ul').prepend(newPost);      //prepend means adding from top or first position                                            
                    // call the create comment class
                    new PostComments(data.data.post._id);

                    //call the class ToggleLike on each new post
                    new ToggleLike($(' .toggle-like-button'),newPost);          
                    
                    new Noty({
                        layout:'topRight',
                        theme:'metroui',
                        type:'success',
                        text: data.message,  
                        timeout:1500       
                        }).show();         
                    deletePost($(' .delete-post-button',$(this)));  //Populating deletePost fn on each delete link in each dynamic post only
                    //Then event inside deletePost fn will trigger ajax fn to delete post
                    $('#postTextArea').val(''); //clearing post form textarea
                },
                error:function(error){
                    console.log(error.responseText);
                    new Noty({
                        layout:'topRight',
                        theme:'metroui',
                        type:'error',
                        text: error.responseText,  
                        timeout:1500       
                        }).show();
                }
            });
        });
    }

    //method to created a post in DOM
    let newPostDOM=function(post){
        return $(`<li id="post-${post._id}">
        <p>
            <span class="post_content">${post.content}</span>
            <span class="post_user"><small>
                -: ${post.user.name}
            </small></span>
            <span class="post_likes"><small>
                    <a class="toggle-like-button" data-likes="0" href="/likes/toggle/?id=${post._id}&type=Post">
                        <i class="fa-solid fa-heart">&nbsp;<small>0</small></i><span class="sr-only"> Likes</span> 
                    </a>
            </small></span>
            <span class="post_delete"><small>
                <small class="delete_post">
                        <a class="delete-post-button" href="/posts/destroy/${post._id}">
                            <i class="fa-solid fa-trash"></i><span class="sr-only">x</span>    
                        </a>
                    </small>
            </small></span>
            <!-- Early Layout -->
            <!--
            // <small>
            //     <a class="delete-post-button" href="/posts/destroy/${post._id}">X</a>
            // </small>
            // ${post.content}
            // <br>
            // <small>
            // ${post.user.name}
            // </small>
            // <br>
            // <small>
            //     <a class="toggle-like-button" data-likes="0" href="/likes/toggle/?id=${post._id}&type=Post">
            //         0 Likes
            //<!-- Showing 0 Likes , as this post is just created --><!--
            //     </a>
            // </small>
            -->
        </p>
        <div class="post-comments">
            <form  id="post-${ post._id }-comments-form" action="/comments/create" method="post">
                <textarea name="content" cols="30" rows="1" placeholder="Type here to add comment ..." id="post-${ post._id }-comments-form-textarea"></textarea>
                <input type="hidden" name="post" value="${post._id}" >
                <input type="submit" value="Add Comment">
            </form>
        </div>
        <div class="post-comment-list">
            <ul id="post-comments-${post._id}">
            </ul>
        </div>
    </li>`);
    }

    //method to delete a post from DOM
    let deletePost=function(deleteLink){
        $(deleteLink).click(function(e){
            e.preventDefault();
            $.ajax({
                type:'get',
                url:$(deleteLink).prop('href'),
                success:function(data){
                    //Now here we remove the li (consist of post) , and this li has id made up of post id ex-in post.ejs <li id="post-<%= post._id %>">
                    //how we get that post id, we get that from success callback data arg. This data is set in JSON res in delete post controller
                    $(`#post-${data.data.post_id}`).remove();
                    new Noty({
                        layout:'topRight',
                        theme:'metroui',
                        type:'success',
                        text: data.message,  
                        timeout:1500
                        }).show(); 
                },
                error:function(error){
                    console.log('Error',error.responseText);
                    new Noty({
                        layout:'topRight',
                        theme:'metroui',
                        type:'error',
                        text: error.responseText,  
                        timeout:1500       
                        }).show();
                }
            });
        });
    }

    // loop over all the existing posts on the page (when the window loads for the first time) &
    //call the delete post method on delete link of each, also add AJAX (using the class we've created) to the delete button of each
    let convertPostToAjax=function(){
        $('#posts-list-container>ul>li').each(function(){
            deletePost($(' .delete-post-button',$(this)));  
            
            // get the post's id by splitting the id attribute
            let postId = $(this).prop('id').split("-")[1]
            new PostComments(postId);
        });   
    }
    createPost();
    convertPostToAjax();
}