### Specification

This document describes how showing and gathering feedback data from lisk-service will he handled by lisk-hub application logic. 


- Each component will have a uniqueID
- uniqueID should be formed by componentName. 
- Settings store will be enhanced with a new key `feedback`
- each entry in feedback will be indexed by componentID, and containing the following fields

#### Settings Data model
```
settings: {
	feedback: {
    	choosenToBeHidden: [Boolean], // false
	}
}
```

- **choosenToBeHidden** = `false`, setted to `true` when user clicks _"I don't want to see these again"_

#### Feedback Data model


```
Question {
	title: [String],
	type: [String],
	options: [[String],...]
}
```


```
feedback: {
  	enabledIn: [[String], [String]],
	general: {
		questions: [Question, ...],
	},
	components: {
		[componentID]: { 
			showInterval: [Date/Millisecconds],
			questions: [Question, ...],
			lastGivenOn: [Date/Millisecconds],
		}
	}
}
```
- **showInterval** = `undefined` indicates to show feedback in &#8734; periods, (never repeat)

#### Implementation details

Pseudo code for loading feedback data:

---

```
onApplicationStart () => {
  getFeedbackData = reponse =>
    update state.settings.feedback.choosenToBeHidden = response.choosenToBeHiddenForced
    update state.feedback = {...response}
}
```
- **choosenToBeHiddenForced** = `true` indicates to force reset the flag from server response and never show any feedback on clients.


---

Pseudo code for rendering a component:

---

```
onFeedbackShouldShow(componentId) =>

  settingsObj = state.settings.feedback
  if state.feedback.enabledIn[componentId] && !settingsObj.choosenToBeHidden

    componentObj  = feedback.components.componentId
    todayDate = new Date().getTime()

      if !componentObj.lastGivenOn ||
        componentObj.lastGivenOn > todayDate + settings.feedback.showInterval

        componentObj.lastGivenOn = todayDate;
        render feature feedback;
        return;

  render component;
  ...
  on feedback closed
  if user choosenToBeHidden 
    state.feedback.choosenToBeHidden = true

```

---

#### When to show feature feedback

* on component focus, we set a flag, the flag is updated on every focus event on component. When component is blur, we show feedback if interval is greater than a constant. 
* on beforeunload of window
* on componentWillUnmount - will happen most likely when transitioning between views, e.g. Dashboard --> Wallet

#### Edge cases

* multiple components enabled on same page (Dashboard) the view might look overcrowded. We might impose a limit, in showing a component feedback only if 
`settings.feedback.current` is empty.
