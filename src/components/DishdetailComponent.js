/* eslint-disable */
import React, { Component } from 'react';
import { Card, CardImg, CardText, CardBody, CardTitle, Breadcrumb, BreadcrumbItem, Button, Row, Col, Label, Modal, ModalHeader, ModalBody } from 'reactstrap';
import { Link } from 'react-router-dom';
import { LocalForm, Control, Errors } from 'react-redux-form';
import { Loading } from './LoadingComponent';
import { baseUrl } from '../shared/baseUrl';
import { FadeTransform, Fade, Stagger } from 'react-animation-components';

const maxLength = (len) => (val) => !(val) || (val.length <= len);
const minLength = (len) => (val) => (val) && (val.length >= len);

class CommentForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isCommentModalOpen: false
        };
        this.toggleCommentModal = this.toggleCommentModal.bind(this);
        this.handleCommentSubmit = this.handleCommentSubmit.bind(this);
    }

    toggleCommentModal() {
        this.setState({
            isCommentModalOpen: !this.state.isCommentModalOpen
        });
    }

    handleCommentSubmit(values) {
        this.toggleCommentModal();
        this.props.postComment(this.props.dishId, values.rating, values.author, values.comment);
    }

    render(){
        return(
            <>
                <Button outline color="secondary" onClick={this.toggleCommentModal}>
                    <span className="fa fa-pencil fa-lg"></span> Submit Comment
                </Button>
                <Modal isOpen={this.state.isCommentModalOpen} toggle={this.toggleCommentModal}>
                    <ModalHeader toggle={this.toggleCommentModal}>Submit Comment</ModalHeader>
                    <ModalBody>
                        <LocalForm onSubmit={(values) => this.handleCommentSubmit(values)}>
                            <Row className="form-group">
                                <Label htmlFor="rating" xs={12}>Rating</Label>
                                <Col xs={12}>
                                    <Control.select model=".rating" name="rating"
                                        className="form-control">
                                        <option>1</option>
                                        <option>2</option>
                                        <option>3</option>
                                        <option>4</option>
                                        <option>5</option>
                                    </Control.select>
                                </Col>
                            </Row>
                            <Row className="form-group">
                                <Label htmlFor="name" xs={12}>Your Name</Label>
                                <Col xs={12}>
                                    <Control.text model=".author" id="name" name="name"
                                        placeholder="Your Name"
                                        className="form-control"
                                        validators={{
                                            minLength: minLength(3), maxLength: maxLength(15)
                                        }} />
                                    <Errors
                                        className="text-danger"
                                        model=".author"
                                        show="touched"
                                        messages={{
                                            minLength: 'Must be greater than 2 characters',
                                            maxLength: 'Must be 15 characters or less'
                                        }}
                                    />
                                </Col>
                            </Row>
                            <Row className="form-group">
                                <Label htmlFor="comment" xs={12}>Comment</Label>
                                <Col xs={12}>
                                    <Control.textarea model=".comment" id="comment" name="comment"
                                        className="form-control" rows="6" />
                                </Col>
                            </Row>
                            <Row className="form-group">
                                <Col>
                                    <Button type="submit" color="primary">Submit</Button>
                                </Col>
                            </Row>
                        </LocalForm>
                    </ModalBody>
                </Modal>
            </>
        );
    }
}

function RenderDish({ dish }) {
    if (dish != null) {
        return(
            <div className="col-12 col-md-5 m-1">
                <FadeTransform in
                    transformProps={{
                        exitTransform: 'scale(0.5) translateY(-50%)'
                    }}>
                    <Card>
                        <CardImg width="100%" src={baseUrl + dish.image} alt={dish.name} />
                        <CardBody>
                            <CardTitle>{dish.name}</CardTitle>
                            <CardText>{dish.description}</CardText>
                        </CardBody>
                    </Card>
                </FadeTransform>
            </div>
        );
    }
    else{
        return(
            <div></div>
        );
    }
}

function RenderComments({ commentList, postComment, dishId }) {
    if (commentList != null){
        const comments = commentList.map((comment) => {
            return(
                <Fade in>
                    <li key={comment.id}>
                        <p>{comment.comment}</p>
                        <p>-- {comment.author}, {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit' }).format(new Date(Date.parse(comment.date)))}</p>
                    </li>
                </Fade>
            );
        });

        return(
            <div className="col-12 col-md-5 m-1">
                <h4>Comments</h4>
                <ul className="list-unstyled">
                    <Stagger in>
                        {comments}
                        <CommentForm dishId={dishId} postComment={postComment} />
                    </Stagger>
                </ul>
            </div>
        );
    }
    else{
        return(
            <div></div>
        );
    }
}

const Dishdetail = (props) => {
    if (props.isLoading) {
        return(
            <div className="container">
                <div  className="row">
                    <Loading />
                </div>
            </div>
        );
    }
    else if (props.errMess) {
        return(
            <div className="container">
                <div  className="row">
                    <h4>{props.errMess}</h4>
                </div>
            </div>
        );
    }
    else if (props.dish != null) {
        return(
            <div className="container">
                <div classname="row">
                    <Breadcrumb>
                        <BreadcrumbItem><Link to='/menu'>Menu</Link></BreadcrumbItem>
                        <BreadcrumbItem active>{props.dish.name}</BreadcrumbItem>
                    </Breadcrumb>
                    <div classname="col-12">
                        <h3>{props.dish.name}</h3>
                        <hr />
                    </div>
                </div>
                <div className="row">
                    <RenderDish dish={ props.dish } />
                    <RenderComments commentList = { props.comments }
                        postComment={props.postComment}
                        dishId={props.dish.id} />
                </div>
            </div>
        );
    }
    else{
        return(
            <div></div>
        );
    }
    
}

export default Dishdetail;