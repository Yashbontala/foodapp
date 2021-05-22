import React, { Component } from 'react';
import { Card, CardImg, CardText, CardBody, CardTitle, Breadcrumb, BreadcrumbItem } from 'reactstrap';
import{Button, Modal, ModalHeader, ModalBody, Label } from 'reactstrap';
import { Control, LocalForm, Errors } from 'react-redux-form';
import { Link } from 'react-router-dom';
import { Loading } from './LoadingComponent';
import { baseUrl } from '../shared/baseUrl';
import { FadeTransform, Fade, Stagger } from 'react-animation-components';
const required = (val) => val && val.length;
const maxLength = (len) => (val) => !(val) || (val.length <= len);
const minLength = (len) => (val) => val && (val.length >= len);
class CommentForm extends Component {
    constructor(props) {
        super(props);

        this.state={
            Rating:'1.',
            Name:' ',
            Comment:' ',
            touched: {
                Name:false
            },

            isModalOpen: false
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
    }
    toggleModal() {
        this.setState({
          isModalOpen: !this.state.isModalOpen
        });
      }
      handleSubmit(values) {
          this.toggleModal();
          this.props.postComment(this.props.dishId, values.rating, values.author, values.comment);
    }
    render(){
        return(
            <div>
                <Button outline onClick={this.toggleModal}><span className="fa fa-pencil fa-lg"></span>Comment Form</Button>
                <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
                        <ModalHeader toggle={this.toggleModal}>Submit Comment</ModalHeader>
                        <ModalBody>
                        <LocalForm onSubmit={(values) => this.handleSubmit(values)}>
                            <div className="form-group">
                            <Label htmlFor="Rating" md={2}><strong>Rating</strong></Label>
                                <div md={{size: 3, offset: 1}}>
                                    <Control.select model=".Rating" name="Rating"
                                        className="form-control">
                                        <option>1</option>
                                        <option>2</option>
                                        <option>3</option>
                                        <option>4</option>
                                        <option>5</option>
                                    </Control.select>
                                </div>
                            </div>
                            <div className="form-group">
                            <Label htmlFor="Name" md={2}><strong>Name</strong></Label>
                                <div md={10}>
                                    <Control.text model=".Name" id="Name" name="Name"
                                        placeholder="Name"
                                        className="form-control"
                                        validators={{
                                            required, minLength: minLength(3), maxLength: maxLength(15)
                                        }}
                                         />
                                    <Errors
                                        className="text-danger"
                                        model=".Name"
                                        show="touched"
                                        messages={{
                                            required: 'Required',
                                            minLength: 'Must be greater than 2 characters',
                                            maxLength: 'Must be 15 characters or less'
                                        }}
                                     />
                                </div>
                            </div>
                            <div className="form-group">
                                <Label htmlFor="comment" md={2}><strong>Comment</strong></Label>
                                <div md={10}>
                                    <Control.textarea model=".Comment" id="Comment" name="Comment"
                                        rows="6"
                                        className="form-control"
                                         />
                                </div>
                            </div>
                            <div className="form-group">
                                <div md={{size:10, offset: 2}}>
                                    <Button type="submit" color="primary">
                                    Send Feedback
                                    </Button>
                                </div>
                            </div>
                        </LocalForm>
                        </ModalBody>
                    </Modal>
            </div>
        );
    }
}
   function  RenderComments({commentarr,postComment, dishId}){
    let options = { year: 'numeric', month: 'short', day: '2-digit' };
    const comm = commentarr.map((comment) => {
        if(comment!=null)
        
        return (
          
          <div>
               <Fade in>
            <ul className="list-unstyled" id={comment.id}>
                <li><p>{comment.comment}</p>
                <p>--{comment.author} , {new Date(comment.date).toLocaleDateString("en-US", options)}</p></li>
            </ul>
            </Fade>
          </div>
         
        );
    
        
        
        else
            return(
                <div> </div>
            );
         
    });
    return(
        <div >
            <h4>Comments</h4>
            <Stagger in>
            {comm}
            </Stagger>
            <CommentForm dishId={dishId} postComment={postComment} />
        </div>
    );
}
function RenderDish({dish}){
    return(
        <div>
            <FadeTransform
                in
                transformProps={{
                    exitTransform: 'scale(0.5) translateY(-50%)'
                }}>
        <Card>    
        <CardImg top src={baseUrl + dish.image} alt={dish.name} />
            <CardBody>
              <CardTitle>{dish.name}</CardTitle>
              <CardText>{dish.description}</CardText>
            </CardBody>
        </Card>
        </FadeTransform>
         </div>
        
    );
}
  const DishDetail=(props)=>{
    if (props.isLoading) {
        return(
            <div className="container">
                <div className="row">            
                    <Loading />
                </div>
            </div>
        );
    }
    else if (props.errMess) {
        return(
            <div className="container">
                <div className="row">            
                    <h4>{props.errMess}</h4>
                </div>
            </div>
        );
    }
    else if(props.dish!=null)
    return (
        <div className="container">
        <div className="row">
            <Breadcrumb>

                <BreadcrumbItem><Link to="/menu">Menu</Link></BreadcrumbItem>
                <BreadcrumbItem active>{props.dish.name}</BreadcrumbItem>
            </Breadcrumb>
            <div className="col-12">
                <h3>{props.dish.name}</h3>
                <hr />
            </div>                
        </div>
        <div className="row">
            <div className="col-12 col-md-5 m-1">
                <RenderDish dish={props.dish}/>
            </div>
            <div className="col-12 col-md-5 m-1">
            <RenderComments commentarr={props.comments}
        postComment={props.postComment}
        dishId={props.dish.id}
      />
            </div>
        </div>
        </div>
    );
      

}
export default DishDetail;
