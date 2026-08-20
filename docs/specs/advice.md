I need advice with the following: this is a redux tools 2.0 application; so far so good. 

you see the MediaStore this is a type of a slice. The reducer is then bundled in the configurestore under the key called store. 

Then when I use useAppStore in App.tsx at line 7, then why state in that is automatically MediaStore and not the root type for example, I don't get it... 