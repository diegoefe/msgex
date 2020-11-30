function cleanDir()
{
	local base=$1
	echo "cleanDir(${base})"
	rm -rfv ${base}
}

cleanDir node_modules
