while true
do
	echo "Which part of version do you want to increase?"
	echo "2) Major"
	echo "1) Minor"
	echo "0) Patch"
	read trg
	case $trg in
		0 ) ver="patch"; break;;
		1 ) ver="minor"; break;;
		2 ) ver="major"; break;;
		* ) echo "Invalid option. Please try again.";;
	esac
done
npm version $ver --message "Released a new version"

echo ""
read -p "Press ENTER key to exit..."