import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Subject } from "rxjs";
import { map } from 'rxjs/operators';
import { Router } from "@angular/router";

import { Post } from "./post.model";

@Injectable({ providedIn: "root" })
export class PostsService {

  private posts: Array<Post> = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private http:HttpClient, private router: Router) {}

  getPosts() {
    this.http
      .get<{
        message: string,
        posts: Array<any>
      }>('http://localhost:3000/api/posts')

      .pipe(map((postData) => {
        return postData.posts.map(post => {
          const postFormatted:Post =  {
            id: post._id,
            title: post.title,
            content: post.content
          }
          return postFormatted;
        });
      }))

      .subscribe(postsFormatted => {
        this.posts = postsFormatted;
        this.postsUpdated.next([...this.posts]);
      });
  }

  getPostsUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getPost(postId: string) {
    return this.http.get
      <{_id: string, title: string, content: string}>
      ('http://localhost:3000/api/posts/' + postId);
  }

  // getPost(postId: string) {
  //   const result = this.posts.find(post => post.id === postId);
  //   if (result === undefined) {
  //     return null;
  //   } else {
  //     return {...result}
  //   }
  // }

  addPost(title: string, content: string) {
    const post:Post = { id: '', title: title, content: content };
    this.http
      .post<{ message: string, postId: string }>('http://localhost:3000/api/posts', post)
      .subscribe(responseData => {
        post.id = responseData.postId;
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(["/"]);
      });
  }

  updatePost(id: string, title: string, content: string) {
    const updatedPost:Post = { id: id, title: title, content: content };
    this.http
      .put('http://localhost:3000/api/posts/' + id, updatedPost)
      .subscribe(response => {
        const updatedPosts = [...this.posts];
        const index = updatedPosts.findIndex(p => p.id === updatedPost.id);
        updatedPosts[index] = updatedPost;
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(["/"]);
      })
  }

  deletePost(id: string) {
    this.http
      .delete('http://localhost:3000/api/posts/' + id)
      .subscribe(() => {
        const updatedPosts = this.posts.filter(post => post.id !== id)

        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }
}
