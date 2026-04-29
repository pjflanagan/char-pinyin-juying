
# Overhaul

I still want to avoid going down the route of building a really detailed website for this. BUT I want this website to be nice and robust.

## Makefile

The Makefile should be my orchestrator.
It should be well documented and live on the top level of the repo.

## Data Management

We need a suite of data management tools. We kinda have this with scripts, but I think they can be improved. 
Some should run automatically, others should be called more easily from the Makefile.

## Site Content

Some of the site is hard to edit.
Markdown might be a good way around this. Or yml files.

I don't want to make this a whole Jekyll app, I think that's overkill as there is no blog.

Figure out the best way to import data to pages so I don't have to go into the weeds everytime.

### Flashcard page

Should not have to update manually with the sets, should use the sets manifest file that is generated when sets are updated.
