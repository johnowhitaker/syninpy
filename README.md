# syninpy README

Hackily adding syntax highlighting to JS snippets in python

Extension page: https://marketplace.visualstudio.com/items?itemName=JohnoWhitaker.syninpy

Warning: experimental, not tested much, use at your own risk :)

## Usage

Include your snippets in the code like this to get syntax highlighting:


```python

def python_function():
    print("Hello World")

#js
script = """
document.addEventListener('DOMContentLoaded', function() {
    var accordionItems = document.querySelectorAll('.accordion-item');

    accordionItems.forEach(function(item) {
        item.addEventListener('shown.bs.collapse', function() {
            var headerElement = this.querySelector('.accordion-header');
            var yOffset = -10; // Adjust this value to fine-tune the scroll position
            var y = headerElement.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({top: y, behavior: 'smooth'});
        });
    });
});
"""

def another_python_function():
    print("Hello World")

```

You can also end with #end-js. Note it skips the line immediately after the #js tag.