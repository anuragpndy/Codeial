// Let's implement this via classes

// this class would be initialized for every post on the page
// 1. When the page loads
// 2. Creation of every post dynamically via AJAX

class PostComments{
    // constructor is used to initialize the instance of the class whenever a new instance is created
    constructor(postId){
        this.postId = postId;
        this.postContainer = $(`#post-${postId}`);
        this.newCommentForm = $(`#post-${postId}-comments-form`);
        
        this.createComment(postId);

        let self = this;
        // call for all the existing comments
        $(' .delete-comment-button', this.postContainer).each(function(){
            self.deleteComment($(this));        //here $(this) is same this
        });
    }


    createComment(postId){
        let pSelf = this;       //refering to PostComments class
        this.newCommentForm.submit(function(e){
            e.preventDefault();
            let self = this;        //refering to newCommentForm
            $.ajax({
                type: 'post',
                url: '/comments/create',
                data: $(self).serialize(),
                success: function(data){
                    let newComment = pSelf.newCommentDom(data.data.comment,data.data.post);
                    $(`#post-comments-${postId}`).prepend(newComment);
                    pSelf.deleteComment($(' .delete-comment-button', newComment));      
                    //here 2nd argument newComment make sure that, call deleteComment on .delete-comment-button which is inside only newComment  

                    //call the class ToggleLike on each comment post
                    new ToggleLike($(' .toggle-like-button'),newComment);
                    //here 2nd argument newComment make sure that, call ToggleLike on .toggle-like-button which is inside only newComment

                    new Noty({
                        theme: 'relax',
                        text: "Comment published!",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                        
                    }).show();
                    $(`#post-${postId}-comments-form-textarea`).val('');

                }, error: function(error){
                    console.log(error.responseText);
                }
            });


        });
    }


    newCommentDom(comment,post){
        // I've added a class 'delete-comment-button' to the delete comment link and also id to the comment's li
        return $(`<li id="comment-${ comment._id }">
                        <p> 
                            <span class="comment_content">${comment.content}</span>
                            <span class="comment_user"><small>
                                -: ${comment.user.name}
                            </small></span><br>
                            <span class="comment_likes"><small>
                                    <a class="toggle-like-button" data-likes="0" href="/likes/toggle/?id=${comment._id}&type=Comment">
                                        <i class="fa-solid fa-heart">&nbsp;<small>0</small></i><span class="sr-only"> Likes</span> 
                                    </a>
                            </small></span>
                            <span class="comment_delete">
                                    <small class="delete_comment">
                                        <a class="delete-comment-button" href="/comments/destroy/${comment._id}/${post._id}">
                                            <i class="fa-solid fa-trash"></i><span class="sr-only">x</span>    
                                        </a>
                            </small></span>

                          
                        <!-- Early Layout -->
                        <!--
                            // <small>
                            //     <a class="delete-comment-button" href="/comments/destroy/${comment._id}/${post._id}">X</a>
                            // </small>
 
                            // ${comment.content}
                            // <br>
                            // <small>
                            //     ${comment.user.name}
                            // </small>
                            // <br>
                            // <small>
                            //     <a class="toggle-like-button" data-likes="0" href="/likes/toggle/?id=${comment._id}&type=Comment">
                            //         0 Likes
                            //     <!-- Showing 0 Likes , as this comment is just created--><!--
                            //     </a>
                            // </small>
                            -->
                        </p>    

                </li>`);
    }


    deleteComment(deleteLink){
        $(deleteLink).click(function(e){
            e.preventDefault();

            $.ajax({
                type: 'get',
                url: $(deleteLink).prop('href'),
                success: function(data){

                    $(`#comment-${data.data.comment_id}`).remove();

                    new Noty({
                        theme: 'relax',
                        text: "Comment Deleted",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500    
                    }).show();
                },error: function(error){
                    console.log(error.responseText);
                }
            });

        });
    }
}