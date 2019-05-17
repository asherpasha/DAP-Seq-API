# DAP-Seq-API
An URL query-based API redirection tool to Dr. Joseph Ecker's (SALK) DAP-Seq Genome browser.

**DAP-Seq API @ [Bio-Analytic Resource for Plant Biology](http://bar.utoronto.ca/)**
----
  Redirects user to DNA Affinity Purification (DAP)-Seq A. th. genome browser based on query parameter of TF and target gene. That is, our API will create the necessary beautified options in the genome browser such as target gene locus to allow for quicker, streamlined data visualization. Note that the authors performed some replicates on certain TFs on A. th. Col-0. For more information on the DAP-Seq method, please see the seminal [paper](https://www.ncbi.nlm.nih.gov/pubmed/27203113). API happily made with expressjs (Pug for templating).

* **URL Example**

http://bar.utoronto.ca/DAP-Seq-API?target=At2g48010&tf=At1g44830

* **Method:**
  
  `GET`
  
*  **URL Params**

   **Required:**
     
       `target=[TARGETGENEAGI]` // e.g. At2g48010
       `TF=[TFGENEAGI]` // e.g. At1g44830

* **Success Response:**

  * Redirection to DAP-Seq SALK genome browser with modified options...
  * e.g. <http://neomorph.salk.edu/aj2/pages/hchen/dap_ath_pub.php?active=DAP+data&location=2:19641351:600:20&hide=["1_2","3_11"]&config=[{id:"1_2",height:300,scale:1.5},{id:"3_11",height:300,scale:1.5}]&settings={yaxis:250,accordion:"collapsed"}>
  * OR redirection to a page that links out to multiple DAP-Seq replicates
  * e.g. <http://bar.utoronto.ca/DAP-Seq-API?target=At2g46330&tf=At2g33710>
  
  * **Code:** 200 <br />
 
* **Error Response:**

  * **Code:** `400` `404` `500` <br />
   
  * **Content:**
    Basic HTML describing error. For example for an incorrect AGI syntax:
    ```
    Incorrect AGI!
    ```
    
* **Credits:**

    * Vincent Lau (design/dev), Rachel Woo (creating JSON), Huaming Chen (Ecker lab genome browser), thanks to NSERC Canada and Dr. Nicholas Provart for funding. 
    
    * Last updated: May 2019 (also check Git commits)
    
    * API ReadMe template credits: https://gist.github.com/iros/3426278
    
* **Maintainer Notes:**
    
    * API that uses our geneslider API to determine the target gene locus, then uses a lookup table (JSON file) to find the appropriate track_id to create and redirect user to Ecker lab's browser. Use `DEBUG='express*,dap-seq-nodejs-api*' nodemon npm start` to start server. Port 3003 should be opened and forwarded if using Apache/NGINX.
`
    
    
