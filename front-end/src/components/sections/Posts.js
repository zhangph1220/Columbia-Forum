import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

class Posts extends Component {
  constructor() {
    super();

    this.state = {
      postsContentElements: [],
      title: '',
      content: ''
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.getAllPosts = this.getAllPosts.bind(this);
  }

  componentDidMount() {
    this.getAllPosts();
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onSubmit(e) {
    e.preventDefault();

    axios
      .post(
        'https://pfuel2ck1b.execute-api.us-east-2.amazonaws.com/api/forum-post',
        {
          Title: this.state.title,
          Content: this.state.content,
          Author: localStorage.currentUserName
        }
      )
      .then(res => {
        console.log(res);
        this.setState({
          title: '',
          content: ''
        });
        this.getAllPosts();
      })
      .catch(err => console.log(err));
  }

  getAllPosts() {
    axios
      .get(
        'https://pfuel2ck1b.execute-api.us-east-2.amazonaws.com/api/forum-post/all'
      )
      .then(res => {
        const postsContent = res['data'];

        const postsContentElements = [];
        for (let n of postsContent) {
          const postPath = {
            pathname: '/post',
            state: n['PostID']
          };
          const userImg =
            'https://s3.amazonaws.com/columbia-forum/userImg/' +
            n['Author'] +
            '.png';
          postsContentElements.push(
            <div className='card card-body mb-3' key={n['PostID']}>
              <div className='row'>
                <div className='col-md-2'>
                  <Link to={postPath}>
                    <img
                      className='rounded-circle d-none d-md-block'
                      alt=''
                      src={userImg}
                    />
                  </Link>
                  <br />
                  <p className='text-center'>{n['Author']}</p>
                </div>
                <div className='col-md-10'>
                  <Link className='link-type' to={postPath}>
                    <p className='lead'>{n['Title']}</p>
                    <p>{n['Content']}</p>
                  </Link>
                </div>
              </div>
            </div>
          );
        }
        this.setState({ postsContentElements });
      });
  }

  render() {
    return (
      <div className='row'>
        <div className='col-md-12'>
          <div className='post-form mb-3'>
            <div className='card card-info'>
              <div className='card-header bg-info text-white'>
                Say Something...
              </div>
              <div className='card-body'>
                <form onSubmit={this.onSubmit}>
                  <div className='form-group'>
                    <textarea
                      className='form-control'
                      rows='1'
                      placeholder='Create the title'
                      name='title'
                      value={this.state.title}
                      onChange={this.onChange}
                    />
                    <br />
                    <textarea
                      className='form-control'
                      rows='5'
                      placeholder='Create a post'
                      name='content'
                      value={this.state.content}
                      onChange={this.onChange}
                    />
                  </div>
                  <button type='submit' className='btn btn-dark'>
                    Submit
                  </button>
                </form>
              </div>
            </div>
          </div>
          <div className='posts'>{this.state.postsContentElements}</div>
        </div>
      </div>
    );
  }
}

export default Posts;
