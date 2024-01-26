# Client-Side Rendering vs. Server-Side Rendering

### FED25 - Reactor Assessment

## Introduction

Thus far, we've only worked on a client-side-rendered (CSR) application, often referred to as a single page application (SPA). In a SPA, all html is generated in the browser by executing your JS code. Interacting with dynamic components and navigating between pages is handled by your JS code.

An alternative approach to a SPA application is a Server-Side Rendered (SSR) application. An SSR application renders all html on a backend server and there is very little, if any javascript executed in the browser. Navigating between pages, directs the browser to a new URL, which loads new HTML from the backend server. Loading content from a backend can be quicker with SSR if the application is hosted on the same server, but external API calls likely take the same amount of time.

In this exercise, you will work in your project groups to learn about the practical differences between a SPA app and a SSR app in React. You will do this by running your own app with both CSR and SSR components, implementing some basic functionality and observing the results.

The app retrieves a random image from the NASA "Picture of the day" website, then displays the image title, the image, and its description on the page 🛰️

## Background

Read the following background material to get oriented:

- [SSR vs. SPA overview + opinion](https://thenewstack.io/spas-and-react-you-dont-always-need-server-side-rendering/) (you can stop when you reach "Using Vite with React")
- [SSR vs. SPA pros and cons](https://www.linkedin.com/pulse/main-key-difference-between-spa-single-page-ssr-server-sachin-yadav-zcncf/)
- [React docs "Getting Started" recommendations](https://react.dev/learn/start-a-new-react-project#production-grade-react-frameworks) - Note that Next.js is the first recommendation.

## Setup

1. Get NASA API key [here](https://api.nasa.gov/)
2. Fork the repo via Github UI
3. Clone your projet repo `git clone <YOUR GIT REPO>`
4. Go to the repo directory `cd ssr-vs-csr`
5. Install dependencies `npm install`
6. Replace the text `DEMO_KEY` with your NASA API key in `src/constants.js`

## Exercise 1 - Understand the code

This very simple application is built with [Next.js](https://nextjs.org/). Next.js is a powerful framework for building both SSR and SPA React applications and is widely used in industry. It generates SSR code by default, but pages and components can easily be set up as "client components" in order to generate CSR code.

Next.js requires a certain folder structure and certain files in order for the app to work properly. We can consider those to be boilerplate and their contents won't be discussed here.

One note - Routing in Next.js is managed by the folder structure within the `src/app` folder. That's why this app has multiple routes, but no router code 🤯

The following files are of interest for this exercise:

```
src
┣ app
┃ ┣ ssr
┃ ┃ ┗ page.js
┃ ┣ static
┃ ┃ ┗ page.js
┃ ┗ page.js
┣ components
┃ ┣ content.js
┃ ┗ ssrReload.js
┣ constants.js
┗ helpers.js
```

`src/constants.js` - Your API key goes here.

`src/helpers` - Contains a helper function for pre-loading an image from its URL. This allows the SSR app to download the image on the server, then include it as part of the HTML code that it passes to the browser for an "instant load" effect.

`src/app/static/page.js` - This is the code for the CSR page. Read and understand this code thoroughly

`src/app/ssr/page.js` - This is the code for the SSR page. Note that it looks quite a bit different from the CSR page. There is some code missing from this file, in the next exercise, you'll implement it.

`src/components/content.js` - This is the component responsible for showing the content loaded from the NASA API on both the CSR and static pages.

`src/components/ssrReload.js` - This is a reload button for the SSR page. Because it's used by an SSR component, it has to be identified as a client (CSR) component by placing the string "use client" at the top of the file. A client component is required because SSR components can't execute JS functions (this one runs a function to refresh the page when the button is clicked).

## Exercise 2 - Fill in the blank

A segment of code is missing in the file `src/app/ssr/page.js`. It is the code to retrieve the API data from the NASA API server. Time to write that code.

Run the server with `npm run dev` to get a development server running. Try clicking the "Static Page" link at the top of the page. (Note: It loads twice because this is dev mode. We're not worried about that in this exercise. Try clicking the "Refresh" button on the page to see it load correctly.) Notice the `Loading...` text as the API data is retrieved.

In `static/page.js`, we have to use `useEffect` to run our `async` fetch request. In SSR code, we can't use hooks like `useEffect` and `useState`. Take a moment and try adding a `useState` variable to the SSR page code to see what happens.

Because this is a server component, our code is running on the server, so we can just write a regular `async` function to load our data, then call that function in our component code to set our data variable. No hooks needed. Look at the comments in the `ssr/page.js` file and do that now.

Hints:

- Our fetch code should look exactly the same as the fetch code in the CSR component, just not in a hook
- We don't need any of those useState variables anymore

Once you have this code written correctly, the page should load immediately with the content from the API.

## Exercise 3 - Caching requests

In Next.js, server fetching caches the result of fetch requests by default. In some cases, this is great. For example, our page loaded a bit slowly on the first visit, but now it loads instantly. The tradeoff is that the result of the request is the same every time, which we don't want here. We want a random picture every time we visit the page. In order to turn off caching for our request, pass a second argument to the `fetch` function like so `fetch('<API_URL>', { cache: "no-cache" })`.

Now try refreshing the page.

## Exercise 4 - Optimized image loading

Our SSR page loads instantly, but the image is still retrieved on the frontend, so there is a moment between when the page first loads and when the image displays on-screen. Let's fix that.

In your `getData()` function, we want to use our async `imageUrlToBase64(url: string)` function to convert the image url to a chunk of data that is passed along in the html. The `imageUrlToBase64` function is located in the `src/helpers.js` file. Do that now.

Hints:

- You need to pass the url of the image to the function and it will return the image data
- The image data can be passed to the `src` prop of the `Image` component in the `components/content.js` file. In fact, it already is...you just need to put it on the `json` object.

Once you have this working, you should see the image load instantly - no delay between the page loading and the image loading. You can inspect the HTML in your browser to see the image data on the `src` attribute of `<img>` tag. This is known as Base64 encoding and is a perfectly valid way to load images on the web.

## Exercise 5 - Compare CSR and SSR

Now that you've run both CSR and SSR versions of this app, you can compare them and see the differences. Observe how the pages load on the CSR and SSR pages, how it loads when you click the "Refresh" button, along with the experience of waiting for the page to load.

In our project, the SSR and CSR apps will are working with an external API, so they both take about the same amount of time to load. The big difference is when/how that load time happens. Which of the two versions do you experience to load faster?

## Questions

- What is the difference between SSR and CSR?
  - SSR
    - The initial rendering of the web page is done on the server side. This one sends fully rendered HTML to the client and the client receives a ready page, reducing the time to first render. Subsequent interactions might involve client-side rendering for dynamic content.
  - CSR
    - The initial HTML is minimal, and the bulk of rendering is donde on the client side using JS, so the client fetches data and updates the DOM dinamically. Finally, the initial load might be faster as only essential HMTL and scripst are sent from the server.
- In what ways do you need to change your code to switch between CSR and SSR?
  - CSR to SSR
    - We move rendering logic anddata fetching to the server, we use frameworks or libraries thar supports server-side rendering and adjust routing to ve handled on the server side.
  - SSR to CSR
    - We transition rendering logic and data fetching to the client side, modify routes to be handled on the clien side, and consider optimizing for asynchronous data loading.
- What are the advantages of SSR?
  - We improve the initial load times, providing a fully renderer page on the initial load, reducing time to first paint and improving user experience.
  - We have SEO benefits by searching engines can more easily index content from the server-rendered HTML.
  - We performance on low-power devices by initializing rendering on the server.
- What are the advantages of CSR?
  - Faster subsequent page loads
  - Better user interactions
  - Scalability
- What are the tradeoffs?
- - SSR
  - Higher server load
  - Slower subsequent page loads
- CSR
  - Initial load time
  - Performance on low-power devices

## Conclusion

In this exercise, you learned about the differences between SSR and CSR in React. You also learned how to implement both SSR and CSR components in a Next.js application.
