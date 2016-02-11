SHELL=/bin/bash
KANGODIR=/opt/kango-framework/

up:
	(git status && git pull)

ci:
	git status
	git pull
	git add src/common/* EXTENSIONS/*
	git ci -m '.' -a
	git push

_build:
	python $(KANGODIR)/kango.py build ./

build:
	rm -rf `find . -name '.DS_Store'`
	rm -rf `find . -name DEADJOE`
	python $(KANGODIR)/kango.py build ./
	cp `ls -1 output/higherschoolofeconomicswebsitestate*.crx | sort -r | head -n 1` EXTENSIONS/higherschoolofeconomicswebsitestate.crx
	cp `ls -1 output/higherschoolofeconomicswebsitestate*.xpi | sort -r | head -n 1` EXTENSIONS/higherschoolofeconomicswebsitestate.xpi
