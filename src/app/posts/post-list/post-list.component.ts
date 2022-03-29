import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";

import { Post } from '../post.model'
import { PostsService } from "../posts.service";

@Component({
  selector: "app-post-list",
  templateUrl: "./post-list.component.html",
  styleUrls: ["./post-list.component.css"],
})

export class PostListComponent implements OnInit, OnDestroy {

  posts: Array<Post> = [];
  isLoading = false;
  private postSub!: Subscription;

  constructor(public postsService: PostsService) {}

  ngOnInit(): void {
    this.postsService.getPosts();
    this.isLoading = true;
    this.postSub = this.postsService.getPostsUpdateListener()
      .subscribe((posts: Post[]) => {
        this.isLoading = false;
        this.posts = posts;
      });
  }

  onDelete(id: string) {
    this.postsService.deletePost(id);
  }

  ngOnDestroy(): void {
    this.postSub.unsubscribe();
  }
}
