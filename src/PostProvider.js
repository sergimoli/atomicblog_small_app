import { createContext, useContext, useMemo, useState } from "react";
import { faker } from "@faker-js/faker";

function createRandomPost() {
  return {
    title: `${faker.hacker.adjective()} ${faker.hacker.noun()}`,
    body: faker.hacker.phrase(),
  };
}

// 1 STEP- create a new context and now we can pass the value into the context provider.
const PostContext = createContext();

function PostProvider({ children }) {
  const [posts, setPosts] = useState(() =>
    Array.from({ length: 30 }, () => createRandomPost())
  );
  const [searchQuery, setSearchQuery] = useState("");

  // Derived state. These are the posts that will actually be displayed
  const searchedPosts =
    searchQuery.length > 0
      ? posts.filter((post) =>
          `${post.title} ${post.body}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        )
      : posts;

  function handleAddPost(post) {
    setPosts((posts) => [post, ...posts]);
  }

  function handleClearPosts() {
    setPosts([]);
  }

  //sOMETHIN important!
  //if we have many, many compoennts that are subscribed to a context, so read data from a context it will become problemtic to have so many different variables inside the context value.
  //because as soon as you change one of these states, for example the post of the search query then all of the componets that read at least one of these five values will get re-rendered. This is not ideal.
  //So, we usually create one context per state. We will have one post context and one search query context
  //if we are using a reducer we can create one context for the state and one context for the dispatch function.

  const value = useMemo(() => {
    return {
      posts: searchedPosts,
      onAddPost: handleAddPost,
      onClearPost: handleClearPosts,
      searchQuery,
      setSearchQuery,
    };
  }, [searchedPosts, searchQuery]);

  return (
    <PostContext.Provider value={value}>{children}</PostContext.Provider>

    // <PostContext.Provider
    //   value={{
    //     posts: searchedPosts,
    //     onAddPost: handleAddPost,
    //     onClearPost: handleClearPosts,
    //     searchQuery,
    //     setSearchQuery,
    //   }}
    // >
    //   {children}
    // </PostContext.Provider>
  );
}

function usePosts() {
  const context = useContext(PostContext);
  if (context === undefined)
    //this is like a solution for the developer. instead of returning 'undefined' in the console.log is better to find a big error message in red ;)
    throw new Error("PostContext was used outside of the PostProvider");
  return context;
}

// export { PostProvider, PostContext };
export { PostProvider, usePosts };
